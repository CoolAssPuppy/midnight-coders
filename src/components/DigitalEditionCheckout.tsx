"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { trackBeginCheckout, PRODUCTS } from "@/lib/analytics";
import { DEFAULT_CHECKOUT_PREFERENCES } from "@/lib/checkout-preferences";

/**
 * Starts a Stripe Checkout session for the digital edition.
 *
 * No captcha here by design. The endpoint creates a Stripe session and nothing
 * else, so the abuse ceiling is low, and a challenge on a buy button costs real
 * sales. The route is rate limited instead.
 */
export function DigitalEditionCheckout({
  children,
}: {
  children?: ReactNode;
}): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(): Promise<void> {
    setIsLoading(true);
    setError(null);

    trackBeginCheckout(PRODUCTS.digitalEdition);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEFAULT_CHECKOUT_PREFERENCES),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Checkout session did not return a URL");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="checkout">
      <div className="buy__actions">
        {children}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="buy__cta checkout__button"
        >
          {isLoading ? "Opening checkout" : "Buy Direct from the Author"}
        </button>
      </div>

      {error && (
        <p className="checkout__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
