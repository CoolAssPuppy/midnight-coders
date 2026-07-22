import type { AnalyticsDestination } from "../types";

interface DataLayerWindow {
  dataLayer: Record<string, unknown>[];
}

export const gtmDestination: AnalyticsDestination = {
  name: "gtm",

  send(event: string, properties: Record<string, unknown>): void {
    if (typeof window === "undefined") return;

    const w = window as unknown as DataLayerWindow;
    w.dataLayer = w.dataLayer || [];

    // GA4 best practice: clear the ecommerce object before pushing a new one.
    w.dataLayer.push({ ecommerce: null });
    w.dataLayer.push({ event, ...properties });
  },
};
