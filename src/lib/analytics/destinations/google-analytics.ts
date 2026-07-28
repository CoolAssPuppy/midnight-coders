import type { AnalyticsDestination } from "../types";

/**
 * GA4 measurement id for the book site.
 *
 * Public by design — it ships in the client bundle either way. The
 * Measurement Protocol API secret is the value that must stay server-side, and
 * this destination never touches it: gtag authenticates by origin.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-PT2G856FD7";

type GtagFunction = (...args: unknown[]) => void;

interface GtagWindow {
  gtag?: GtagFunction;
  dataLayer?: unknown[];
}

/**
 * Event names GA4 refuses. It accepts the hit, returns success, and never
 * reports the event — so sending one looks exactly like working
 * instrumentation until somebody reconciles against another source.
 *
 * `error` is the trap: it reads like an ordinary custom event.
 */
const RESERVED_EVENT_NAMES = new Set([
  "ad_activeview", "ad_click", "ad_exposure", "ad_impression", "ad_query",
  "ad_reward", "adunit_exposure", "app_clear_data", "app_exception",
  "app_install", "app_remove", "app_store_refund",
  "app_store_subscription_cancel", "app_store_subscription_convert",
  "app_store_subscription_renew", "app_update", "app_upgrade",
  "dynamic_link_app_open", "dynamic_link_app_update",
  "dynamic_link_first_open", "error", "firebase_campaign",
  "firebase_in_app_message_action", "firebase_in_app_message_dismiss",
  "firebase_in_app_message_impression", "first_open", "first_visit",
  "in_app_purchase", "notification_dismiss", "notification_foreground",
  "notification_open", "notification_receive", "notification_send",
  "os_update", "session_start", "user_engagement",
]);

/** Parameter prefixes Google reserves. Parameters using them are dropped. */
const RESERVED_PARAMETER_PREFIXES = ["_", "ga_", "google_", "firebase_", "gtag."];

/** GA4 caps most parameter values at 100 characters. These three get more. */
const LONG_VALUE_ALLOWANCES: Readonly<Record<string, number>> = {
  page_title: 300,
  page_referrer: 420,
  page_location: 1000,
};

/**
 * Coerce a name into what GA4 accepts: alphanumerics and underscores, starting
 * with a letter, at most 40 characters.
 */
function sanitizeEventName(name: string): string {
  let cleaned = name.replace(/[^a-zA-Z0-9_]/g, "_");
  if (!/^[a-zA-Z]/.test(cleaned)) cleaned = `e_${cleaned.replace(/^_+/, "")}`;
  return cleaned.slice(0, 40);
}

/**
 * Drop what GA4 will not store, truncate what exceeds its limits.
 *
 * The `ecommerce` object is the reason this matters here. Our events carry a
 * nested `ecommerce` payload for the ad platforms alongside flat `value` and
 * `currency` copies. gtag reads the flat ones; the nested object would arrive
 * as nothing useful, so it is dropped rather than stringified.
 */
function sanitizeProperties(
  properties: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  for (const key of Object.keys(properties).sort()) {
    if (Object.keys(result).length >= 25) break;
    if (RESERVED_PARAMETER_PREFIXES.some((p) => key.startsWith(p))) continue;

    const value = properties[key];
    if (value === null || value === undefined) continue;

    if (typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    } else if (typeof value === "string") {
      result[key] = value.slice(0, LONG_VALUE_ALLOWANCES[key] ?? 100);
    }
  }

  return result;
}

/**
 * Google Analytics 4, via gtag.
 *
 * Sends events only. The gtag snippet itself is loaded in `layout.tsx`, because
 * how a script gets onto the page is a layout concern rather than a destination
 * one.
 *
 * Deliberately no `identify`: this site has no accounts, and setting a
 * `user_id` from an email or order id would push PII into GA4.
 */
export const googleAnalyticsDestination: AnalyticsDestination = {
  name: "google-analytics",

  send(event: string, properties: Record<string, unknown>): void {
    if (typeof window === "undefined") return;
    if (RESERVED_EVENT_NAMES.has(event)) return;

    const gtag = (window as GtagWindow).gtag;
    if (!gtag) return;

    gtag("event", sanitizeEventName(event), sanitizeProperties(properties));
  },
};
