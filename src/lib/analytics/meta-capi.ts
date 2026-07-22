import { createHash } from "node:crypto";
import type { MetaEventName, MetaCustomData } from "./meta-events";
import type { AdAttribution } from "./ad-refs";
import type { ConversionResult, SendOptions } from "./openai-capi";

/**
 * Meta Conversions API.
 *
 * The server twin of the browser pixel. Meta deduplicates on the pair
 * (event_name, event_id) within 48 hours, and when both arrive inside 5 minutes
 * the browser event wins.
 *
 * See https://developers.facebook.com/docs/marketing-api/conversions-api
 */

const GRAPH_VERSION = "v24.0";

/** Meta accepts events up to 7 days old, same as OpenAI. */
const MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface MetaServerEvent {
  /** Must match the browser event's `eventID` for the same conversion. */
  id: string;
  name: MetaEventName;
  customData: MetaCustomData;
  sourceUrl: string;
  /** Raw email. Hashed before it leaves this process. */
  email?: string;
  attribution?: AdAttribution;
  timestampMs?: number;
}

interface MetaUserData {
  em?: string[];
  fbc?: string;
  fbp?: string;
  client_ip_address?: string;
  client_user_agent?: string;
}

interface MetaPayload {
  event_name: MetaEventName;
  /** Meta takes seconds, not milliseconds. This trips people up constantly. */
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: "website";
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
}

/**
 * Meta requires the same normalization as OpenAI (trim, lowercase) before
 * SHA-256, but wants the result in an array because it accepts multiple emails.
 */
export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function buildMetaPayload(event: MetaServerEvent): MetaPayload {
  const timestampMs = event.timestampMs ?? Date.now();

  const userData: MetaUserData = {};
  if (event.email) userData.em = [hashEmail(event.email)];

  const attribution = event.attribution ?? {};
  // fbc and fbp are sent raw. Hashing them would break matching entirely.
  if (attribution.fbc) userData.fbc = attribution.fbc;
  if (attribution.fbp) userData.fbp = attribution.fbp;
  if (attribution.ipAddress) userData.client_ip_address = attribution.ipAddress;
  if (attribution.userAgent) userData.client_user_agent = attribution.userAgent;

  const payload: MetaPayload = {
    event_name: event.name,
    event_time: Math.floor(timestampMs / 1000),
    event_id: event.id,
    event_source_url: event.sourceUrl,
    action_source: "website",
    user_data: userData,
  };

  if (Object.keys(event.customData).length > 0) {
    payload.custom_data = event.customData;
  }

  return payload;
}

export function isEventTooOld(timestampMs: number, now: number): boolean {
  return now - timestampMs > MAX_EVENT_AGE_MS;
}

/**
 * Send a conversion to Meta. Never throws, for the same reason as the OpenAI
 * client: a measurement failure must not fail the Stripe webhook.
 */
export async function sendMetaConversion(
  event: MetaServerEvent,
  options: SendOptions & { testEventCode?: string } = {},
): Promise<ConversionResult> {
  const accessToken = process.env.META_CONVERSIONS_ACCESS_TOKEN;
  const datasetId = process.env.NEXT_PUBLIC_META_DATASET_ID;

  if (!accessToken) return { sent: false, skipped: "missing_api_key" };
  if (!datasetId) return { sent: false, skipped: "missing_pixel_id" };

  const payload = buildMetaPayload(event);

  if (isEventTooOld(payload.event_time * 1000, Date.now())) {
    console.warn(`Meta conversion ${event.id} is older than 7 days, skipping`);
    return { sent: false, skipped: "event_too_old" };
  }

  const body: Record<string, unknown> = { data: [payload] };

  // Meta's equivalent of a dry run: events land in Test Events rather than
  // production reporting.
  if (options.testEventCode) body.test_event_code = options.testEventCode;

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(datasetId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const detail = await response.text().catch(() => "");

    if (!response.ok) {
      console.error(
        `Meta conversion ${event.id} rejected (${response.status}): ${detail}`,
      );
      return { sent: false, status: response.status, detail };
    }

    return { sent: true, status: response.status, detail };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`Meta conversion ${event.id} failed to send:`, error);
    return { sent: false, detail };
  }
}
