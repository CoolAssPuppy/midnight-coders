import type { ReactElement } from "react";

/**
 * The shape every notification shares.
 *
 * Consuming sites declare their own discriminated union on top of this. The
 * engine never needs to know what a site's events are, only that each one
 * names a type, names a recipient, and carries data its template understands.
 */
export interface BaseNotification {
  type: string;
  to: string;
  data: unknown;
}

export type NotifyResult =
  | { ok: true; channel: "email"; providerMessageId: string }
  | { ok: true; skipped: true; reason: "suppressed" | "no_recipient" }
  | { ok: false; error: string; retryable: boolean };

export interface RegistryEntry<N> {
  subject: (notification: N) => string;
  render: (notification: N) => ReactElement;
}

/**
 * Binds every notification type to what the reader receives.
 *
 * Subjects live here rather than inside templates so a site's whole set can be
 * read at once. Inbox lines are the only part of an email most people see, and
 * they are easier to keep consistent in a list than spread across many files.
 */
export type Registry<N extends BaseNotification> = {
  [K in N["type"]]: RegistryEntry<Extract<N, { type: K }>>;
};

/**
 * Identifies one logical send, so a retry cannot produce a second email.
 *
 * The correlation id identifies the underlying event rather than the attempt.
 * For payments that is a Stripe checkout session id; for form submissions it
 * is whatever record the handler just created. Pairing it with the type means
 * one event can drive several distinct notifications without either
 * suppressing the other.
 */
export function buildIdempotencyKey(
  type: string,
  correlationId: string,
): string {
  return `${correlationId}:${type}`;
}
