import {
  assertLiveMailConfigured,
  getTransport,
} from "./transport/index";
import type {
  MailTransport,
  OutgoingAttachment,
} from "./transport/types";
import { renderEmail } from "./render";
import {
  buildIdempotencyKey,
  type BaseNotification,
  type NotifyResult,
  type Registry,
} from "./types";

export interface NotifierConfig<N extends BaseNotification> {
  registry: Registry<N>;
  /**
   * Resolved per send rather than captured once, so a site can read it from
   * the environment without the package caring how it is configured.
   */
  from: () => string;
  replyTo?: () => string | undefined;
  /**
   * Overrides the mode-based transport. Only for tests that want an isolated
   * recorder rather than the shared sandbox singleton.
   */
  transport?: MailTransport;
  /** Inline images every message carries, referenced from HTML by content id. */
  attachments?: () => OutgoingAttachment[];
}

export type Notifier<N extends BaseNotification> = (
  notification: N,
  correlationId: string,
) => Promise<NotifyResult>;

/**
 * Build a site's notification engine.
 *
 * Every transactional message in a consuming codebase goes through the
 * function this returns. Callers describe what happened; the engine decides
 * what is sent, to whom, over which channel, and whether it is safe to send.
 *
 * The returned function never throws. Its callers are payment webhooks and
 * form handlers that must be able to record a failure and still return 2xx,
 * because a non-2xx makes the sender redeliver and re-run every other side
 * effect alongside it.
 */
export function createNotifier<N extends BaseNotification>(
  config: NotifierConfig<N>,
): Notifier<N> {
  return async function notify(
    notification: N,
    correlationId: string,
  ): Promise<NotifyResult> {
    const recipient = notification.to.trim();

    if (recipient.length === 0) {
      return { ok: true, skipped: true, reason: "no_recipient" };
    }

    try {
      assertLiveMailConfigured();

      const entry = config.registry[
        notification.type as N["type"]
      ] as RegistryEntryFor<N>;

      if (!entry) {
        return {
          ok: false,
          error: `No registry entry for notification type "${notification.type}"`,
          retryable: false,
        };
      }

      const { html, text } = await renderEmail(entry.render(notification));
      const transport = config.transport ?? getTransport();

      const result = await transport.send({
        to: recipient,
        from: config.from(),
        replyTo: config.replyTo?.(),
        subject: entry.subject(notification),
        html,
        text,
        attachments: config.attachments?.(),
        idempotencyKey: buildIdempotencyKey(notification.type, correlationId),
        tags: { notification: notification.type.replace(/\./g, "_") },
      });

      if (!result.ok) {
        // Logged here rather than at the call site so every failure is
        // recorded the same way. The address is omitted: this line lands in
        // hosting provider logs.
        console.error(
          `Notification ${notification.type} failed for ${correlationId}: ${result.error}`,
        );

        return result;
      }

      return {
        ok: true,
        channel: "email",
        providerMessageId: result.providerMessageId,
      };
    } catch (cause) {
      const error = cause instanceof Error ? cause.message : String(cause);
      console.error(
        `Notification ${notification.type} threw for ${correlationId}: ${error}`,
      );

      return { ok: false, error, retryable: true };
    }
  };
}

/**
 * The registry is keyed by type, so each entry only ever receives its own
 * variant. TypeScript cannot follow that through a dynamic index, so the
 * lookup is narrowed once here rather than at every use.
 */
type RegistryEntryFor<N extends BaseNotification> = {
  subject: (notification: N) => string;
  render: (notification: N) => ReturnType<Registry<N>[N["type"]]["render"]>;
};
