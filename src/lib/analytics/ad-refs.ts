/**
 * Ad-click attribution references for OpenAI Ads and Meta Ads.
 *
 * Both platforms work the same way: a click identifier that arrives as a URL
 * parameter on the ad landing page, and a browser identifier the pixel sets.
 * Both live in first-party cookies.
 *
 *   OpenAI: __oppref (click)  __obref (browser)
 *   Meta:   _fbc     (click)  _fbp    (browser)
 *
 * A Stripe webhook is a server-to-server request from Stripe, so it has no
 * cookies, no client IP, and no user agent. These values must be captured
 * during checkout, where the request is still same-origin, and carried to the
 * webhook through Stripe session metadata.
 *
 * Reading them server-side rather than through `document.cookie` also keeps
 * working if either vendor marks their cookies HttpOnly.
 */

export interface AdRefs {
  oppref?: string;
  obref?: string;
  fbc?: string;
  fbp?: string;
}

export interface AdAttribution extends AdRefs {
  ipAddress?: string;
  userAgent?: string;
}

/** Stripe caps metadata values at 500 characters. */
const MAX_METADATA_LENGTH = 500;

/** Prefixed so these never collide with product metadata. */
export const AD_METADATA_KEYS = {
  oppref: "ad_oppref",
  obref: "ad_obref",
  fbc: "ad_fbc",
  fbp: "ad_fbp",
  ipAddress: "ad_ip",
  userAgent: "ad_ua",
} as const;

const COOKIE_NAMES: Record<keyof AdRefs, string> = {
  oppref: "__oppref",
  obref: "__obref",
  fbc: "_fbc",
  fbp: "_fbp",
};

function truncate(value: string): string {
  return value.slice(0, MAX_METADATA_LENGTH);
}

/**
 * Validate references coming from an untrusted source. These end up in Stripe
 * metadata and in outbound API calls, so they are type-checked and length
 * capped rather than trusted as received.
 */
export function sanitizeRefs(input: unknown): AdRefs {
  if (typeof input !== "object" || input === null) return {};

  const candidate = input as Record<string, unknown>;
  const refs: AdRefs = {};

  for (const key of Object.keys(COOKIE_NAMES) as (keyof AdRefs)[]) {
    const value = candidate[key];
    if (typeof value === "string" && value) {
      refs[key] = truncate(value);
    }
  }

  return refs;
}

/**
 * Read every ad reference cookie from an incoming request.
 *
 * Takes a lookup function rather than a NextRequest so this module stays free
 * of server-only imports.
 */
export function readRefsFromCookies(
  getCookie: (name: string) => string | undefined,
): AdRefs {
  const raw: Record<string, string | undefined> = {};

  for (const [key, cookieName] of Object.entries(COOKIE_NAMES)) {
    raw[key] = getCookie(cookieName);
  }

  return sanitizeRefs(raw);
}

/** Flatten attribution into Stripe metadata, omitting absent values. */
export function toStripeMetadata(
  attribution: AdAttribution,
): Record<string, string> {
  const metadata: Record<string, string> = {};

  for (const [field, metadataKey] of Object.entries(AD_METADATA_KEYS)) {
    const value = attribution[field as keyof AdAttribution];
    if (value) {
      metadata[metadataKey] = truncate(value);
    }
  }

  return metadata;
}

/** Recover attribution from Stripe session metadata inside the webhook. */
export function fromStripeMetadata(
  metadata: Record<string, string> | null | undefined,
): AdAttribution {
  if (!metadata) return {};

  const attribution: AdAttribution = {};

  for (const [field, metadataKey] of Object.entries(AD_METADATA_KEYS)) {
    const value = metadata[metadataKey];
    if (value) {
      attribution[field as keyof AdAttribution] = value;
    }
  }

  return attribution;
}
