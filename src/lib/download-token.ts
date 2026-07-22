import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed download tokens for the digital edition.
 *
 * The book is sold as a pre-order before it exists, so a token carries both a
 * not-before and an expiry. The buyer receives their permanent link in the
 * confirmation email immediately; the link simply refuses to serve the file
 * until release day. That avoids having to run a launch-day email campaign to
 * everyone who pre-ordered.
 *
 * Tokens are stateless HMACs. There is deliberately no download counter: that
 * would need a datastore, and this site has none. A buyer who forwards their
 * link shares access until it expires.
 */

export interface TokenPayload {
  /** Stripe checkout session id, so a token traces back to a real payment. */
  sessionId: string;
  /** Not before, epoch ms. */
  notBefore: number;
  /** Expires at, epoch ms. */
  expiresAt: number;
}

export type TokenFailure =
  | "malformed"
  | "bad_signature"
  | "not_yet_valid"
  | "expired";

export type TokenVerification =
  | { valid: true; payload: TokenPayload }
  | { valid: false; reason: TokenFailure; payload?: TokenPayload };

function getSecret(): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) {
    throw new Error("DOWNLOAD_TOKEN_SECRET environment variable is not set");
  }

  return secret;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(encodedPayload: string): string {
  return createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createDownloadToken(payload: TokenPayload): string {
  const encoded = base64UrlEncode(JSON.stringify(payload));

  return `${encoded}.${sign(encoded)}`;
}

/**
 * Compare signatures in constant time so a token cannot be brute forced by
 * measuring how long a rejection takes.
 */
function isSignatureValid(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(actual, "utf8");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function parsePayload(decoded: string): TokenPayload | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(decoded);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;

  const candidate = parsed as Record<string, unknown>;
  if (
    typeof candidate.sessionId !== "string" ||
    typeof candidate.notBefore !== "number" ||
    typeof candidate.expiresAt !== "number"
  ) {
    return null;
  }

  return {
    sessionId: candidate.sessionId,
    notBefore: candidate.notBefore,
    expiresAt: candidate.expiresAt,
  };
}

export function verifyDownloadToken(
  token: string,
  now: number = Date.now(),
): TokenVerification {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return { valid: false, reason: "malformed" };
  }

  const encodedPayload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!isSignatureValid(sign(encodedPayload), signature)) {
    return { valid: false, reason: "bad_signature" };
  }

  const payload = parsePayload(base64UrlDecode(encodedPayload));
  if (!payload) {
    return { valid: false, reason: "malformed" };
  }

  // Signature is verified before these checks, so the timestamps are trusted
  // and can be surfaced to the buyer ("unlocks September 22").
  if (now < payload.notBefore) {
    return { valid: false, reason: "not_yet_valid", payload };
  }

  if (now > payload.expiresAt) {
    return { valid: false, reason: "expired", payload };
  }

  return { valid: true, payload };
}
