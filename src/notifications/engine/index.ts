/**
 * Notification engine.
 *
 * Sites declare their own events, templates, and design. This package owns the
 * plumbing every site shares: transport, rendering, idempotency, error
 * classification, and the sandbox behaviour that keeps development and tests
 * off the network.
 *
 *   // notifications/index.ts
 *   export const notify = createNotifier<Notification>({
 *     registry: REGISTRY,
 *     from: () => process.env.MAIL_FROM ?? "",
 *   });
 */

export { createNotifier } from "./notify";
export type { Notifier, NotifierConfig } from "./notify";

export { defineRegistry, forType } from "./registry";

export { buildIdempotencyKey } from "./types";
export type {
  BaseNotification,
  NotifyResult,
  Registry,
  RegistryEntry,
} from "./types";

export { renderEmail } from "./render";
export type { RenderedEmail } from "./render";

export {
  assertLiveMailConfigured,
  getMailMode,
  getTransport,
  ResendTransport,
} from "./transport/index";
export type { MailMode } from "./transport/index";
export type {
  MailTransport,
  OutgoingMessage,
  SendResult,
} from "./transport/types";
