"use client";

import { trackPurchase, identifyUser, PRODUCTS } from "@/lib/analytics";
import { useMountEffect } from "@/hooks/useMountEffect";

interface PurchaseEventProps {
  /** Stripe checkout session id, shared with the server-side conversions. */
  transactionId: string;
  customerEmail?: string;
}

/**
 * Fires the browser half of the purchase conversion.
 *
 * The webhook sends the same conversion server-side using this same
 * transactionId, and both OpenAI and Meta collapse the pair into one.
 * Renders nothing.
 */
export function PurchaseEvent({
  transactionId,
  customerEmail,
}: PurchaseEventProps): null {
  useMountEffect(() => {
    if (customerEmail) {
      identifyUser(customerEmail, { email: customerEmail });
    }

    trackPurchase(PRODUCTS.digitalEdition, transactionId);
  });

  return null;
}
