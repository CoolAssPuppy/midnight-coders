/**
 * Where a marketing-consent prompt is required before pixels load.
 *
 * The EEA, UK, and Switzerland need a grant. Paid Meta traffic is almost
 * entirely outside that set, and gating the pixel there is what dropped
 * Landing Page Views to ~10% of link clicks.
 *
 * Unknown or missing country stays strict, so a missed geo header never
 * loads tags in a region that requires a prompt.
 */

export const CONSENT_REGION_COOKIE = "mcc_consent_region";

export type ConsentRegion = "strict" | "open";

const STRICT_CONSENT_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
]);

/**
 * Vercel uses XX for an unresolved country and T1 for Tor. Treat both as
 * strict so we never infer an open region from a placeholder.
 */
const UNKNOWN_COUNTRY_CODES = new Set(["XX", "T1"]);

export function consentRegionFromCountry(
  country: string | null | undefined,
): ConsentRegion {
  if (!country) return "strict";

  const code = country.trim().toUpperCase();
  if (!code || UNKNOWN_COUNTRY_CODES.has(code)) return "strict";

  return STRICT_CONSENT_COUNTRIES.has(code) ? "strict" : "open";
}

export function parseConsentRegion(
  value: string | null | undefined,
): ConsentRegion | null {
  if (value === "open" || value === "strict") return value;
  return null;
}
