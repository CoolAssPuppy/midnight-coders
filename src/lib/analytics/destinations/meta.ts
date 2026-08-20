import type { AnalyticsDestination } from "../types";
import { toMetaEvents, type MetaEvent } from "../meta-events";

import { sanitizePixelId } from "../pixel-id";

/** Public dataset (pixel) id. The Conversions API token is the secret half. */
export const META_DATASET_ID = sanitizePixelId(
  process.env.NEXT_PUBLIC_META_DATASET_ID,
);

type FbqFunction = ((...args: unknown[]) => void) & {
  /** Installed by fbevents.js on load. The inline snippet's stub has no such property. */
  callMethod?: unknown;
};

interface FbqWindow {
  fbq?: FbqFunction;
}

/**
 * Whether `fbq` will actually send, rather than queue into a stub.
 *
 * The inline snippet in `layout.tsx` defines `fbq` synchronously and pushes
 * calls onto `fbq.queue` until fbevents.js arrives. If that script 503s or is
 * blocked, `typeof fbq === "function"` is still true, the queue never flushes,
 * and every event is lost in silence. `callMethod` is the property fbevents.js
 * installs, so it is what separates a live pixel from a stub.
 */
function isPixelReady(fbq: FbqFunction | undefined): boolean {
  return typeof fbq === "function" && typeof fbq.callMethod === "function";
}

function resolveDatasetId(): string {
  return META_DATASET_ID || sanitizePixelId(process.env.NEXT_PUBLIC_META_DATASET_ID);
}

/**
 * Meta's image/beacon endpoint, used only when `fbq` is missing or throws.
 *
 * It carries fewer match parameters than `fbq` does, because it cannot read the
 * `_fbp` cookie the pixel script sets. Treat it as the lossy backup, never as a
 * second copy of a send that already went out.
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

    const mappedEvents = toMetaEvents(event, properties);
    if (mappedEvents.length === 0) return;

    const fbq = (window as unknown as FbqWindow).fbq;

    // Resolved once, so a fan-out cannot split across transports. RetailerClick
    // and PreorderIntent must travel the same way or their match quality, and
    // therefore their counts, stop being comparable.
    const pixelReady = isPixelReady(fbq);

    for (const mapped of mappedEvents) {
      // One event, one request. Meta deduplicates a browser event against a
      // server event that shares its event_id. It does not deduplicate two
      // browser requests against each other, so sending the same event through
      // both `fbq` and the beacon counts it twice. That shipped on 16 August
      // 2026 and doubled every RetailerClick and PreorderIntent until 20 August.
      if (pixelReady && fbq) {
        try {
          // eventID (capital ID) is the browser-side spelling; the Conversions
          // API spells the same value event_id. That pair is what deduplicates
          // the pixel against the Stripe webhook on Purchase.
          fbq(mapped.method, mapped.name, mapped.customData, {
            eventID: mapped.eventId,
          });
          continue;
        } catch {
          // fbq threw, so nothing left the browser. Fall through to the beacon.
        }
      }

      // Either the pixel script never loaded or fbq threw. Nothing was queued
      // that could flush later, so this cannot double count.

      beaconMetaEvent(mapped);
    }
  },
};
