/**
 * Click identifiers and UTMs, stored first-party after marketing consent.
 *
 * Captured from the landing URL so a later Meta, Amazon, or Google campaign
 * can attribute without another site change. Nothing is written to a cookie
 * until the reader grants measurement.
 */

export const CAMPAIGN_STORAGE_KEY = "mcc_campaign";
export const CAMPAIGN_COOKIE = "mcc_campaign";

export interface CampaignParams {
  fbclid?: string;
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const PARAM_KEYS = [
  "fbclid",
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function sanitizeCampaignParams(input: unknown): CampaignParams {
  if (!isRecord(input)) return {};

  const params: CampaignParams = {};
  for (const key of PARAM_KEYS) {
    const value = input[key];
    if (typeof value === "string" && value.trim()) {
      params[key] = value.trim().slice(0, 500);
    }
  }
  return params;
}

export function readCampaignParamsFromSearch(
  search: string,
): CampaignParams {
  const query = search.startsWith("?") ? search.slice(1) : search;
  if (!query) return {};

  const urlParams = new URLSearchParams(query);
  const raw: Record<string, string> = {};
  for (const key of PARAM_KEYS) {
    const value = urlParams.get(key);
    if (value) raw[key] = value;
  }
  return sanitizeCampaignParams(raw);
}

export function mergeCampaignParams(
  current: CampaignParams,
  incoming: CampaignParams,
): CampaignParams {
  return sanitizeCampaignParams({ ...current, ...incoming });
}

export function readStoredCampaignParams(): CampaignParams {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeCampaignParams(JSON.parse(raw));
  } catch {
    return {};
  }
}

function persistCookie(params: CampaignParams): void {
  if (typeof document === "undefined") return;
  if (Object.keys(params).length === 0) return;

  document.cookie = `${CAMPAIGN_COOKIE}=${encodeURIComponent(JSON.stringify(params))}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

/**
 * Meta's click cookie. Format: fb.1.{unixMs}.{fbclid}
 *
 * Written only after consent, and only when the pixel has not already set _fbc.
 */
export function buildFbc(fbclid: string, nowMs = Date.now()): string {
  return `fb.1.${nowMs}.${fbclid}`;
}

function writeFbc(fbclid: string): void {
  if (typeof document === "undefined") return;
  if (document.cookie.split("; ").some((part) => part.startsWith("_fbc="))) {
    return;
  }

  document.cookie = `_fbc=${buildFbc(fbclid)}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function persistCampaignParams(params: CampaignParams): void {
  const clean = sanitizeCampaignParams(params);
  if (typeof window === "undefined") return;
  if (Object.keys(clean).length === 0) return;

  try {
    window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(clean));
  } catch {
    // Cookie still holds the values if localStorage is blocked.
  }

  persistCookie(clean);
  if (clean.fbclid) writeFbc(clean.fbclid);
}

/**
 * Stash landing-page params in sessionStorage before consent.
 * After grant they move to first-party storage.
 */
const PENDING_KEY = "mcc_campaign_pending";

export function stashLandingCampaignParams(search: string): CampaignParams {
  const incoming = readCampaignParamsFromSearch(search);
  if (typeof window === "undefined") return incoming;
  if (Object.keys(incoming).length === 0) {
    return readPendingCampaignParams();
  }

  const merged = mergeCampaignParams(readPendingCampaignParams(), incoming);
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(merged));
  } catch {
    // Session storage can throw in private mode.
  }
  return merged;
}

export function readPendingCampaignParams(): CampaignParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return {};
    return sanitizeCampaignParams(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function promoteCampaignParamsAfterConsent(): CampaignParams {
  const pending = readPendingCampaignParams();
  const stored = readStoredCampaignParams();
  const merged = mergeCampaignParams(stored, pending);
  persistCampaignParams(merged);
  return merged;
}
