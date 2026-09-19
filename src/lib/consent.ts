import {
  CONSENT_REGION_COOKIE,
  parseConsentRegion,
  type ConsentRegion,
} from "./consent-region";

/**
 * First-party marketing consent.
 *
 * In the EEA, UK, and Switzerland the default is denied and pixels stay
 * unloaded until the reader grants it. Elsewhere tags load unless the reader
 * has opted out from Measurement in the footer.
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

function readConsentRegion(): ConsentRegion | null {
  if (typeof document === "undefined") return null;

  const parts = document.cookie.split("; ");
  const raw = parts
    .find((part) => part.startsWith(`${CONSENT_REGION_COOKIE}=`))
    ?.slice(CONSENT_REGION_COOKIE.length + 1);

  return parseConsentRegion(raw ? decodeURIComponent(raw) : null);
}

/**
 * True when this visit still needs a grant before marketing tags load.
 *
 * Missing cookie is treated as strict so a first paint without the proxy
 * cookie never loads pixels in a prompt region.
 */
export function isStrictConsentRegion(): boolean {
  return readConsentRegion() !== "open";
}

export function hasMarketingConsent(): boolean {
  const stored = readStoredConsent();
  if (stored === "granted") return true;
  if (stored === "denied") return false;
  return readConsentRegion() === "open";
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
