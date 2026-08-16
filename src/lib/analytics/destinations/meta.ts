import type { AnalyticsDestination } from "../types";
import { toMetaEvent, type MetaEvent } from "../meta-events";

import { sanitizePixelId } from "../pixel-id";

/** Public dataset (pixel) id. The Conversions API token is the secret half. */
export const META_DATASET_ID = sanitizePixelId(
  process.env.NEXT_PUBLIC_META_DATASET_ID,
);

type FbqFunction = (...args: unknown[]) => void;

interface FbqWindow {
  fbq?: FbqFunction;
}

function resolveDatasetId(): string {
  return META_DATASET_ID || sanitizePixelId(process.env.NEXT_PUBLIC_META_DATASET_ID);
}

/**
 * Meta's image/beacon endpoint. Used as a transport that survives the tab
 * losing focus when a retailer link opens, and survives same-tab navigation
 * if a future change drops `target="_blank"`.
 */
export function buildMetaBeaconUrl(datasetId: string, event: MetaEvent): string {
  const params = new URLSearchParams();
  params.set("id", datasetId);
  params.set("ev", event.name);
  params.set("eid", event.eventId);
  params.set("noscript", "1");

  for (const [key, value] of Object.entries(event.customData)) {
    if (value === undefined) continue;
    const serialized =
      typeof value === "string" || typeof value === "number"
        ? String(value)
        : JSON.stringify(value);
    params.set(`cd[${key}]`, serialized);
  }

  return `https://www.facebook.com/tr/?${params.toString()}`;
}

function beaconMetaEvent(event: MetaEvent): void {
  const datasetId = resolveDatasetId();
  if (!datasetId) return;
  if (typeof navigator === "undefined") return;
  if (typeof navigator.sendBeacon !== "function") return;

  try {
    navigator.sendBeacon(buildMetaBeaconUrl(datasetId, event));
  } catch {
    // Never let a pixel failure break the page.
  }
}

export const metaDestination: AnalyticsDestination = {
  name: "meta",

  send(event: string, properties: Record<string, unknown>): void {
    if (typeof window === "undefined") return;

    const mapped = toMetaEvent(event, properties);
    if (!mapped) return;

    const fbq = (window as unknown as FbqWindow).fbq;
    if (typeof fbq === "function") {
      try {
        // eventID (capital ID) is the browser-side spelling; the server API
        // spells the same value event_id. Meta matches them to deduplicate.
        fbq(mapped.method, mapped.name, mapped.customData, {
          eventID: mapped.eventId,
        });
      } catch {
        // Never let a pixel failure break the page.
      }
    }

    // Custom outbound events also go out on sendBeacon. fbq and the beacon
    // share event_id, so Meta collapses the pair if both land.
    if (mapped.method === "trackCustom") {
      beaconMetaEvent(mapped);
    }
  },
};
