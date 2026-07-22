import type { AnalyticsDestination } from "../types";
import { toOpenAiEvent } from "../openai-events";

import { sanitizePixelId } from "../pixel-id";

/** Public pixel identifier. Not a secret, unlike the Conversions API key. */
export const OPENAI_PIXEL_ID = sanitizePixelId(
  process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID,
);

type OaiqFunction = (...args: unknown[]) => void;

interface OaiqWindow {
  oaiq?: OaiqFunction;
}

/**
 * OpenAI Ads measurement pixel. Only mapped conversion events are forwarded,
 * so the ad account is not polluted with non-conversion traffic.
 */
export const openaiDestination: AnalyticsDestination = {
  name: "openai",

  send(event: string, properties: Record<string, unknown>): void {
    if (typeof window === "undefined") return;

    const mapped = toOpenAiEvent(event, properties);
    if (!mapped) return;

    const oaiq = (window as unknown as OaiqWindow).oaiq;
    if (typeof oaiq !== "function") return;

    try {
      // The inline stub queues calls until the SDK loads, so this is safe
      // before bzrcdn.openai.com has finished downloading.
      oaiq(
        "measure",
        mapped.name,
        mapped.data,
        mapped.eventId ? { event_id: mapped.eventId } : {},
      );
    } catch {
      // Never let a pixel failure break the page.
    }
  },
};
