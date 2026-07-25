import { MemoryTransport } from "./memory";
import { ResendTransport } from "./resend";
import type { MailTransport } from "./types";

export type { MailTransport, OutgoingMessage, SendResult } from "./types";
export { MemoryTransport } from "./memory";
export { ResendTransport } from "./resend";

/**
 * Which transport a given environment gets.
 *
 * `live` is the only mode that sends. It is deliberately not the default: an
 * unset or misspelled `MAIL_MODE` falls back to sandbox, so the failure mode
 * of a bad deploy is silence rather than mail to real buyers. Production
 * asserts the mode at boot instead of relying on the default.
 */
export type MailMode = "live" | "sandbox";

export function getMailMode(): MailMode {
  return process.env.MAIL_MODE === "live" ? "live" : "sandbox";
}

let sandboxTransport: MemoryTransport | null = null;

/** The sandbox transport, so a dev route can inspect what would have been sent. */
export function getSandboxTransport(): MemoryTransport {
  if (!sandboxTransport) {
    sandboxTransport = new MemoryTransport();
  }

  return sandboxTransport;
}

export function getTransport(): MailTransport {
  return getMailMode() === "live" ? new ResendTransport() : getSandboxTransport();
}

/**
 * Fail a production boot that is not configured to actually send.
 *
 * Called from the send path rather than at module load, because a missing key
 * during a build step is fine and a missing key when a buyer has just paid is
 * not.
 */
export function assertLiveMailConfigured(): void {
  if (getMailMode() !== "live") return;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("MAIL_MODE=live but RESEND_API_KEY is not set");
  }
}
