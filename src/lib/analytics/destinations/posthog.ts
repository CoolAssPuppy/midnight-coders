import posthog from "posthog-js";
import type { AnalyticsDestination } from "../types";

/**
 * Initialize the PostHog SDK. Call once from a client-side provider.
 * No-ops if the key is missing so dev and preview builds work without config.
 * Guarded against double-init under React strict mode.
 */
export function initPostHog(): void {
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) return;
  if (posthog.__loaded) return;
  if (window.location.hostname === "localhost") return;

  posthog.init(key, {
    // Same-origin proxy, configured in next.config.ts, so ad blockers that
    // block posthog.com by hostname do not silently drop all analytics.
    api_host: `${window.location.origin}/ingest`,
    ui_host: host || "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    capture_performance: { web_vitals: true },
    disable_session_recording: true,
    persistence: "localStorage+cookie",
  });
}

export const posthogDestination: AnalyticsDestination = {
  name: "posthog",

  send(event: string, properties: Record<string, unknown>): void {
    if (typeof window === "undefined") return;

    try {
      posthog.capture(event, properties);
    } catch {
      // PostHog not initialized yet.
    }
  },

  identify(userId: string, traits?: Record<string, unknown>): void {
    if (typeof window === "undefined") return;

    try {
      posthog.identify(userId, traits);
    } catch {
      // PostHog not initialized yet.
    }
  },
};
