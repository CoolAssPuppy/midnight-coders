import { Resend } from "resend";

import type { MailTransport, OutgoingMessage, SendResult } from "./types";

/**
 * The only file in the codebase permitted to import the Resend SDK.
 *
 * Failures are classified rather than thrown. A caller sending a buyer their
 * download link needs to know whether to retry or to alert a human, and an
 * exception carrying a provider-specific shape would push that decision up
 * into the webhook handler.
 */

/** Provider statuses worth trying again. Anything else is a permanent reject. */
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

function getApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  return apiKey;
}

export class ResendTransport implements MailTransport {
  readonly name = "resend";

  private client: Resend | null = null;

  /**
   * Constructed lazily so importing this module never requires the key. The
   * build, the test suite, and any sandbox run all load it without one.
   */
  private getClient(): Resend {
    if (!this.client) {
      this.client = new Resend(getApiKey());
    }

    return this.client;
  }

  async send(message: OutgoingMessage): Promise<SendResult> {
    try {
      const { data, error } = await this.getClient().emails.send(
        {
          from: message.from,
          to: message.to,
          replyTo: message.replyTo,
          subject: message.subject,
          html: message.html,
          text: message.text,
          attachments: message.attachments?.map((file) => ({
            filename: file.filename,
            content: file.content,
            contentId: file.contentId,
          })),
          tags: message.tags
            ? Object.entries(message.tags).map(([name, value]) => ({
                name,
                value,
              }))
            : undefined,
        },
        // Resend deduplicates on this key, so a redelivered Stripe webhook
        // resolves to the original send rather than a second email.
        { idempotencyKey: message.idempotencyKey },
      );

      if (error) {
        const status = "statusCode" in error ? Number(error.statusCode) : 0;

        return {
          ok: false,
          error: `${error.name}: ${error.message}`,
          retryable: RETRYABLE_STATUS.has(status),
        };
      }

      if (!data?.id) {
        return {
          ok: false,
          error: "Resend returned no message id",
          retryable: true,
        };
      }

      return { ok: true, providerMessageId: data.id };
    } catch (cause) {
      // Network-level failures reach here. These are always worth retrying:
      // the request may never have been seen by the provider at all.
      return {
        ok: false,
        error: cause instanceof Error ? cause.message : String(cause),
        retryable: true,
      };
    }
  }
}
