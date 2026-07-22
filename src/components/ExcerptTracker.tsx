"use client";

import { trackExcerptOpened, trackExcerptProgress } from "@/lib/analytics";
import { useScrollMilestones } from "@/hooks/useScrollMilestones";
import { useMountEffect } from "@/hooks/useMountEffect";

/**
 * Reports how far readers get through the free excerpt.
 *
 * Kept separate from ExcerptReader so a thousand-line rendering component does
 * not also own analytics. Renders nothing.
 */
export function ExcerptTracker(): null {
  useMountEffect(() => {
    trackExcerptOpened();
  });

  useScrollMilestones((percent) => {
    trackExcerptProgress(percent);
  });

  return null;
}
