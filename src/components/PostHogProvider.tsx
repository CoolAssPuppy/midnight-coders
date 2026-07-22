"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { initPostHog } from "@/lib/analytics";
import { useMountEffect } from "@/hooks/useMountEffect";

/**
 * Initializes PostHog once on mount and provides the client to the tree.
 *
 * Initialization happens in an effect rather than at module scope so it never
 * runs during SSR, and it sets no state, which `react-hooks/set-state-in-effect`
 * would flag as an error in this repo.
 */
export function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  useMountEffect(() => {
    initPostHog();
  });

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
