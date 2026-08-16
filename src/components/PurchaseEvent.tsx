"use client";

import { trackPurchase, identifyUser, PRODUCTS } from "@/lib/analytics";
import { useMountEffect } from "@/hooks/useMountEffect";

interface PurchaseEventProps {
  /** Stripe checkout session id, shared with the server-side conversions. */
  transactionId: string;
  customerEmail?: string;
}

const PURCHASE_GUARD_PREFIX = "purchase-event:";

function alreadyRecorded(transactionId: string): boolean {
  try {
    return sessionStorage.getItem(`${PURCHASE_GUARD_PREFIX}${transactionId}`) !== null;
  } catch {
    return false;
  }
}

function markRecorded(transactionId: string): void {
  try {
    sessionStorage.setItem(`${PURCHASE_GUARD_PREFIX}${transactionId}`, "1");
  } catch {
    // Private mode can throw. The mount-only effect still limits this visit.
  }
}

/**
 * Fires the browser half of the purchase conversion.
 *
 * The webhook sends the same conversion server-side using this same
 * transactionId, and both OpenAI and Meta collapse the pair into one.
 * sessionStorage stops a refresh of the confirmation page from sending
 * another browser event. Renders nothing.
 */
export function PurchaseEvent({
  transactionId,
  customerEmail,
}: PurchaseEventProps): null {
  useMountEffect(() => {
    if (alreadyRecorded(transactionId)) return;
    markRecorded(transactionId);

    if (customerEmail) {
      identifyUser(customerEmail, { email: customerEmail });
    }

    trackPurchase(PRODUCTS.digitalEdition, transactionId);
  });

  return null;
}
