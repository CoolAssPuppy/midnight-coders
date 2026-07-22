"use client";

import { useState } from "react";
import { trackBeginCheckout, PRODUCTS } from "@/lib/analytics";

/**
 * Starts a Stripe Checkout session for the digital edition.
 *
 * There is deliberately no captcha here. This endpoint creates a Stripe session
 * and nothing else, so the abuse ceiling is low, and a challenge on a buy button
 * costs real sales. The route is rate limited instead.
 */
export function DigitalEditionCheckout(): React.ReactElement {
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Checkout session did not return a URL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full px-6 py-4 rounded-lg font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "#4EC9B0",
          color: "#0a1628",
          fontFamily: "var(--font-mono)",
        }}
      >
        {isLoading ? "redirecting()..." : "buyDigitalEdition($14.99)"}
      </button>

      {error && (
        <p
          className="mt-3 text-sm text-center"
          role="alert"
          style={{ color: "#f14c4c", fontFamily: "var(--font-mono)" }}
        >
          {`// Error: ${error}`}
        </p>
      )}
    </div>
  );
}
