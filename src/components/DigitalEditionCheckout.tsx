"use client";

import { useState } from "react";
import { trackBeginCheckout, PRODUCTS } from "@/lib/analytics";
import { NewsletterOptIn } from "./NewsletterOptIn";

/**
 * Starts a Stripe Checkout session for the digital edition.
 *
 * No captcha here by design. The endpoint creates a Stripe session and nothing
 * else, so the abuse ceiling is low, and a challenge on a buy button costs real
 * sales. The route is rate limited instead.
 */
export function DigitalEditionCheckout(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Opted in by default. Unchecking is one click, and the box is the only
  // record of the choice, so it is sent to Stripe rather than assumed.
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);

  async function handleCheckout(): Promise<void> {
    setIsLoading(true);
    setError(null);

    trackBeginCheckout(PRODUCTS.digitalEdition);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterOptIn }),
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
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="buy__cta checkout__button"
      >
        {isLoading ? "Opening checkout" : "Pre-order the ebook"}
      </button>

      <NewsletterOptIn checked={newsletterOptIn} onChange={setNewsletterOptIn} />

      <p className="checkout__reassure">Secure checkout by Stripe.</p>

      {error && (
        <p className="checkout__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
