import { createHash } from "node:crypto";
import type {
  OpenAiEventName,
  OpenAiDataType,
  OpenAiContentItem,
} from "./openai-events";
import type { AdAttribution } from "./ad-refs";

/**
 * OpenAI Ads Conversions API.
 *
 * Server events are the durable half of measurement: they survive ad blockers,
 * tracking prevention, and buyers who close the tab before the pixel fires.
 * Sending the same `id` as the browser event deduplicates the pair.
 *
 * See https://developers.openai.com/ads/conversions-api
 */

const ENDPOINT = "https://bzr.openai.com/v1/events";

/** OpenAI rejects events older than 7 days or more than 10 minutes ahead. */
const MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface OpenAiServerEvent {
  /** Must match the browser event's `event_id` for the same conversion. */
  id: string;
  name: OpenAiEventName;
  dataType: OpenAiDataType;
  /** ISO 4217 minor units. */
  amount?: number;
  currency?: string;
  contents?: OpenAiContentItem[];
  sourceUrl: string;
  /** Raw email. Hashed before it leaves this process; never sent in clear. */
  email?: string;
  attribution?: AdAttribution;
  timestampMs?: number;
}

interface EventUser {
  email_sha256?: string;
  obref?: string;
  ip_address?: string;
  user_agent?: string;
}

interface EventPayload {
  id: string;
  type: OpenAiEventName;
  timestamp_ms: number;
  source_url: string;
  action_source: "web";
  data: {
    type: OpenAiDataType;
    amount?: number;
    currency?: string;
    contents?: OpenAiContentItem[];
  };
  /** Event-level, unlike obref which is user-level. */
  oppref?: string;
  user?: EventUser;
}

export type ConversionSkipReason = "missing_api_key" | "missing_pixel_id" | "event_too_old";

export interface ConversionResult {
  sent: boolean;
  status?: number;
  detail?: string;
  skipped?: ConversionSkipReason;
}

export interface SendOptions {
  /** Ask OpenAI to check the payload without recording a conversion. */
  validateOnly?: boolean;
}

/**
 * Hash an email the way OpenAI expects: trimmed, lowercased, SHA-256, lowercase
 * hex. Normalizing first is what makes the hash match on their side.
 */
export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function isEventTooOld(timestampMs: number, now: number): boolean {
  return now - timestampMs > MAX_EVENT_AGE_MS;
}

export function buildOpenAiPayload(event: OpenAiServerEvent): EventPayload {
  const payload: EventPayload = {
    id: event.id,
    type: event.name,
    timestamp_ms: event.timestampMs ?? Date.now(),
    source_url: event.sourceUrl,
    action_source: "web",
    data: { type: event.dataType },
  };

  if (typeof event.amount === "number") payload.data.amount = event.amount;
  if (event.currency) payload.data.currency = event.currency;
  if (event.contents?.length) payload.data.contents = event.contents;

  const attribution = event.attribution ?? {};
  if (attribution.oppref) payload.oppref = attribution.oppref;

  const user: EventUser = {};
  if (event.email) user.email_sha256 = hashEmail(event.email);
  if (attribution.obref) user.obref = attribution.obref;
  if (attribution.ipAddress) user.ip_address = attribution.ipAddress;
  if (attribution.userAgent) user.user_agent = attribution.userAgent;

  if (Object.keys(user).length > 0) payload.user = user;

  return payload;
}

/**
 * Send a conversion to OpenAI Ads. Never throws: measurement must not be able
 * to fail a Stripe webhook, because Stripe would retry the whole delivery and
 * the buyer would be emailed twice.
 */
export async function sendOpenAiConversion(
  event: OpenAiServerEvent,
  options: SendOptions = {},
): Promise<ConversionResult> {
  const apiKey = process.env.OPENAI_CONVERSIONS_API_KEY;
  const pixelId = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;

  if (!apiKey) return { sent: false, skipped: "missing_api_key" };
  if (!pixelId) return { sent: false, skipped: "missing_pixel_id" };

  const payload = buildOpenAiPayload(event);

  if (isEventTooOld(payload.timestamp_ms, Date.now())) {
    console.warn(`OpenAI conversion ${event.id} is older than 7 days, skipping`);
    return { sent: false, skipped: "event_too_old" };
  }

  try {
    const response = await fetch(
      `${ENDPOINT}?pid=${encodeURIComponent(pixelId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          validate_only: options.validateOnly ?? false,
          events: [payload],
        }),
      },
    );

    const detail = await response.text().catch(() => "");

    if (!response.ok) {
      console.error(
        `OpenAI conversion ${event.id} rejected (${response.status}): ${detail}`,
      );
      return { sent: false, status: response.status, detail };
    }

    return { sent: true, status: response.status, detail };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`OpenAI conversion ${event.id} failed to send:`, error);
    return { sent: false, detail };
  }
}
