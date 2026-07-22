import type { AnalyticsDestination, Product } from "./types";
import { gtmDestination } from "./destinations/gtm";
import { posthogDestination } from "./destinations/posthog";
import { openaiDestination } from "./destinations/openai";
import { metaDestination } from "./destinations/meta";

export type { Product } from "./types";
export { PRODUCTS } from "./products";
export { initPostHog } from "./destinations/posthog";
export { OPENAI_PIXEL_ID } from "./destinations/openai";
export { META_DATASET_ID } from "./destinations/meta";

// ---------------------------------------------------------------------------
// Destination registry
// ---------------------------------------------------------------------------

const destinations: AnalyticsDestination[] = [
  gtmDestination,
  posthogDestination,
  openaiDestination,
  metaDestination,
];

/** Send an event to every registered destination. */
function send(event: string, properties: Record<string, unknown>): void {
  for (const destination of destinations) {
    destination.send(event, properties);
  }
}

// ---------------------------------------------------------------------------
// Public tracking API
// ---------------------------------------------------------------------------

interface EcommerceItem extends Product {
  quantity: number;
}

export function trackBeginCheckout(product: Product): void {
  send("begin_checkout", {
    ecommerce: {
      currency: product.currency,
      value: product.price,
      items: [{ ...product, quantity: 1 } as EcommerceItem],
    },
  });
}

export function trackPurchase(product: Product, transactionId: string): void {
  send("purchase", {
    ecommerce: {
      currency: product.currency,
      value: product.price,
      transaction_id: transactionId,
      items: [{ ...product, quantity: 1 } as EcommerceItem],
    },
  });
}

export function trackNewsletterSignup(): void {
  send("newsletter_signup", {});
}

export type BookRetailer = "amazon" | "barnes_and_noble";

/**
 * A click through to a retailer that sells the print book.
 *
 * The purchase completes on Amazon or Barnes & Noble, so this click is the last
 * signal we can observe. Treat the resulting conversion counts as intent, not
 * revenue: some share of these readers never finish the order.
 */
export function trackBookRetailerClick(params: {
  retailer: BookRetailer;
  href: string;
}): void {
  send("book_retailer_click", {
    retailer: params.retailer,
    href: params.href,
  });
}

/**
 * Identify a buyer across destinations that support it. PostHog will
 * retroactively link prior anonymous browsing to this identity.
 */
export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>,
): void {
  for (const destination of destinations) {
    destination.identify?.(userId, traits);
  }
}
