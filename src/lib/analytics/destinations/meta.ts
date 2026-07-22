import type { AnalyticsDestination } from "../types";
import { toMetaEvent } from "../meta-events";

import { sanitizePixelId } from "../pixel-id";

/** Public dataset (pixel) id. The Conversions API token is the secret half. */
export const META_DATASET_ID = sanitizePixelId(
  process.env.NEXT_PUBLIC_META_DATASET_ID,
);

type FbqFunction = (...args: unknown[]) => void;

interface FbqWindow {
  fbq?: FbqFunction;
}

export const metaDestination: AnalyticsDestination = {
  name: "meta",

  send(event: string, properties: Record<string, unknown>): void {
    if (typeof window === "undefined") return;

    const mapped = toMetaEvent(event, properties);
    if (!mapped) return;

    const fbq = (window as unknown as FbqWindow).fbq;
    if (typeof fbq !== "function") return;

    try {
      // eventID (capital ID) is the browser-side spelling; the server API
      // spells the same value event_id. Meta matches them to deduplicate.
      fbq(
        "track",
        mapped.name,
        mapped.customData,
        mapped.eventId ? { eventID: mapped.eventId } : undefined,
      );
    } catch {
      // Never let a pixel failure break the page.
    }
  },
};
