import type { MailTransport, OutgoingMessage, SendResult } from "./types";

/**
 * In-memory transport for tests and for `MAIL_MODE=sandbox` in development.
 *
 * Records every message instead of sending it, so the test suite can assert on
 * what would have gone out without touching the network or spending a real
 * send. Also enforces the idempotency contract locally: a repeat of a key it
 * has already seen returns the original result rather than recording a second
 * message, which is what lets a test prove that a redelivered Stripe webhook
 * cannot double-send.
 */
export class MemoryTransport implements MailTransport {
  readonly name = "memory";

  private readonly messages: OutgoingMessage[] = [];
  private readonly seenKeys = new Map<string, SendResult>();
  private failNext: { error: string; retryable: boolean } | null = null;

  async send(message: OutgoingMessage): Promise<SendResult> {
    const alreadySent = this.seenKeys.get(message.idempotencyKey);
    if (alreadySent) {
      return alreadySent;
    }

    if (this.failNext) {
      const result: SendResult = { ok: false, ...this.failNext };
      this.failNext = null;
      // Deliberately not cached: a failed send must be retryable under the
      // same key, or a transient provider outage would permanently swallow a
      // buyer's receipt.
      return result;
    }

    this.messages.push(message);
    const result: SendResult = {
      ok: true,
      providerMessageId: `memory-${this.messages.length}`,
    };
    this.seenKeys.set(message.idempotencyKey, result);

    return result;
  }

  /** Every message that would have been sent, in order. */
  get sent(): readonly OutgoingMessage[] {
    return this.messages;
  }

  /** The messages addressed to one recipient, for per-buyer assertions. */
  sentTo(email: string): readonly OutgoingMessage[] {
    return this.messages.filter(
      (message) => message.to.toLowerCase() === email.toLowerCase(),
    );
  }

  /** Arrange a single failure, to exercise the caller's error handling. */
  failOnce(error: string, retryable = true): void {
    this.failNext = { error, retryable };
  }

  reset(): void {
    this.messages.length = 0;
    this.seenKeys.clear();
    this.failNext = null;
  }
}
