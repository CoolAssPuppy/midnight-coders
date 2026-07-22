"use client";

import { useEffect, useRef } from "react";

const MILESTONES = [25, 50, 75, 100] as const;

export type ScrollMilestone = (typeof MILESTONES)[number];

/**
 * Fire a callback once each time the reader passes 25, 50, 75, and 100 percent
 * of the page.
 *
 * Deliberately holds no state. A scroll handler that calls setState re-renders
 * on every frame, and `react-hooks/set-state-in-effect` is an error in this
 * repo. Milestones already fired live in a ref, so each reports exactly once
 * per mount however much the reader scrolls back and forth.
 */
export function useScrollMilestones(
  onMilestone: (percent: ScrollMilestone) => void,
): void {
  const firedRef = useRef<Set<number>>(new Set());
  const callbackRef = useRef(onMilestone);
  const frameRef = useRef<number | null>(null);

  // Track the latest callback without re-binding the scroll listener. Writing
  // the ref in an effect rather than during render keeps it off the render path.
  useEffect(() => {
    callbackRef.current = onMilestone;
  }, [onMilestone]);

  useEffect(() => {
    const evaluate = (): void => {
      frameRef.current = null;

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      // A page shorter than the viewport cannot be scrolled through, so
      // reporting 100 percent for it would be meaningless.
      if (scrollable <= 0) return;

      const percent = (window.scrollY / scrollable) * 100;

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !firedRef.current.has(milestone)) {
          firedRef.current.add(milestone);
          callbackRef.current(milestone);
        }
      }
    };

    const onScroll = (): void => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(evaluate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    evaluate();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);
}
