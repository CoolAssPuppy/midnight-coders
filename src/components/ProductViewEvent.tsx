"use client";

import { trackProductView, PRODUCTS } from "@/lib/analytics";
import { useMountEffect } from "@/hooks/useMountEffect";

/**
 * Reports a product view on the purchase page.
 *
 * This is the event ad campaigns should optimize for before launch. Meta needs
 * roughly 50 optimization events a week to leave the learning phase, and a
 * $14.99 pre-order will not produce 50 purchases a week until release.
 * Renders nothing.
 */
export function ProductViewEvent(): null {
  useMountEffect(() => {
    trackProductView(PRODUCTS.digitalEdition);
  });

  return null;
}
