"use client";

import { useEffect, useState } from "react";
import { trackProductView, PRODUCTS } from "@/lib/analytics";
import {
  hasMarketingConsent,
  subscribeMarketingConsent,
} from "@/lib/consent";

/**
 * ViewContent for the paperback on / and /buy.
 *
 * content_name is the novel, content_ids is the Amazon ASIN. Waits for
 * marketing consent so the pixel and CAPI stay dark in prompt regions
 * until agreed.
 * Renders nothing.
 */
export function ProductViewEvent(): null {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(hasMarketingConsent());
    return subscribeMarketingConsent(() => {
      setGranted(hasMarketingConsent());
    });
  }, []);

  useEffect(() => {
    if (!granted) return;
    trackProductView(PRODUCTS.paperback);
  }, [granted]);

  return null;
}
