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
    // Flat copies alongside the nested object. GA4 and the ad platforms read
    // `ecommerce`; PostHog insights are far simpler against top-level
    // properties, and a revenue chart that silently reads zero from a nested
    // path is worse than no chart.
    value: product.price,
    currency: product.currency,
    item_id: product.item_id,
    ecommerce: {
      currency: product.currency,
      value: product.price,
      items: [{ ...product, quantity: 1 } as EcommerceItem],
    },
  });
}

export function trackPurchase(product: Product, transactionId: string): void {
  send("purchase", {
    value: product.price,
    currency: product.currency,
    item_id: product.item_id,
    transaction_id: transactionId,
    ecommerce: {
      currency: product.currency,
      value: product.price,
      transaction_id: transactionId,
      items: [{ ...product, quantity: 1 } as EcommerceItem],
    },
  });
}

/**
 * Someone viewed the product. The highest-volume mid-funnel signal there is.
 *
 * Ad platforms need roughly 50 optimization events a week to train on. A $14.99
 * pre-order will never produce that many purchases before launch, so this is
 * the event campaigns should optimize for until real sales volume arrives.
 */
export function trackProductView(product: Product): void {
  send("view_content", {
    value: product.price,
    currency: product.currency,
    item_id: product.item_id,
    ecommerce: {
      currency: product.currency,
      value: product.price,
      items: [{ ...product, quantity: 1 } as EcommerceItem],
    },
  });
}

export function trackNewsletterSignup(): void {
  send("newsletter_signup", {});
}

/**
 * How far a reader got through the free excerpt.
 *
 * The single most useful engagement signal on a book site: it answers whether
 * the sample actually holds people, and drop-off is measured in chapters rather
 * than guessed at. Fires once per milestone per page view.
 */
export function trackExcerptProgress(percent: 25 | 50 | 75 | 100): void {
  send("excerpt_progress", { percent });
}

/** A reader opened the excerpt. Paired with progress to build a funnel. */
export function trackExcerptOpened(): void {
  send("excerpt_opened", {});
}

export type DownloadCategory = "press_kit" | "book_club" | "media_asset";

/** A file download that is not the book itself. */
export function trackFileDownload(params: {
  asset: string;
  category: DownloadCategory;
}): void {
  send("file_download", {
    asset: params.asset,
    category: params.category,
  });
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
