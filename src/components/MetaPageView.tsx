"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type FbqFunction = (...args: unknown[]) => void;

interface FbqWindow {
  fbq?: FbqFunction;
}

/**
 * Fires a Meta PageView on every route change.
 *
 * The pixel's install snippet calls `fbq('track','PageView')` once, when the
 * script first runs. This is an App Router application, so moving between pages
 * never re-executes that script and Meta would record exactly one pageview per
 * session however far a reader gets.
 *
 * That matters beyond reporting: retargeting audiences are built from page
 * visits, so an audience of "people who reached /buy" would never populate.
 *
 * The PageView call has been removed from the install snippet in layout.tsx, so
 * this component owns every pageview including the first. Renders nothing.
 */
export function MetaPageView(): null {
  const pathname = usePathname();

  useEffect(() => {
    const fbq = (window as unknown as FbqWindow).fbq;
    if (typeof fbq !== "function") return;

    try {
      fbq("track", "PageView");
    } catch {
      // Never let a pixel failure break navigation.
    }
  }, [pathname]);

  return null;
}
