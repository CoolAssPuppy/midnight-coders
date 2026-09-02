/**
 * First-party marketing consent.
 *
 * Default is denied. Meta, Google, and OpenAI pixels stay unloaded until the
 * reader grants it. Required for readers in Portugal and the rest of the EEA.
 */

export const MARKETING_CONSENT_STORAGE_KEY = "mcc_marketing_consent";
export const MARKETING_CONSENT_COOKIE = "mcc_marketing_consent";
export const CONSENT_REOPEN_EVENT = "mcc:consent-open";

export type MarketingConsent = "granted" | "denied";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readStoredConsent(): MarketingConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(MARKETING_CONSENT_STORAGE_KEY);
    if (stored === "granted" || stored === "denied") return stored;
  } catch {
    // Private mode can block storage. Treat that as no decision.
  }

  return null;
}

export function getMarketingConsent(): MarketingConsent | null {
  return readStoredConsent();
}

export function hasMarketingConsent(): boolean {
  return readStoredConsent() === "granted";
}

function persistCookie(value: MarketingConsent): void {
  if (typeof document === "undefined") return;
  document.cookie = `${MARKETING_CONSENT_COOKIE}=${value}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function setMarketingConsent(value: MarketingConsent): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(MARKETING_CONSENT_STORAGE_KEY, value);
  } catch {
    // Cookie still records the choice if localStorage is blocked.
  }

  persistCookie(value);
  window.dispatchEvent(new CustomEvent("mcc:consent-change", { detail: value }));
}

export function subscribeMarketingConsent(
  listener: (value: MarketingConsent | null) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handler = (): void => {
    listener(readStoredConsent());
  };

  window.addEventListener("mcc:consent-change", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("mcc:consent-change", handler);
    window.removeEventListener("storage", handler);
  };
}

export function requestConsentPrompt(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT));
}
