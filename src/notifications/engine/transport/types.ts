/**
 * The transport boundary.
 *
 * Everything above this interface is provider-agnostic. Only
 * `transport/resend.ts` imports the Resend SDK, so swapping providers, or
 * running the whole send path in a test with no network, is a one-line change
 * in `transport/index.ts`.
 */

export interface OutgoingAttachment {
  filename: string;
  /** Base64-encoded file contents. */
  content: string;
  /**
   * Set to reference the file from the HTML as `cid:<value>` instead of
   * showing it as a download. Inlining beats linking a remote URL: there is no
   * asset to deploy first and no path that can later move.
   */
  contentId?: string;
}

export interface OutgoingMessage {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /**
   * Stable key for this exact send, used to make retries safe.
   *
   * Stripe redelivers a webhook whenever the handler fails or times out, and
   * the buyer must not receive their receipt twice. Callers derive this from
   * something that identifies the event rather than the attempt, normally the
   * Stripe session id plus the template name.
   */
  idempotencyKey: string;
  /** Surfaced in provider dashboards and webhooks for later attribution. */
  tags?: Record<string, string>;
  attachments?: OutgoingAttachment[];
}

export type SendResult =
  | { ok: true; providerMessageId: string }
  | { ok: false; error: string; retryable: boolean };

export interface MailTransport {
  readonly name: string;
  send(message: OutgoingMessage): Promise<SendResult>;
}
