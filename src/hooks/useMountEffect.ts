import { useEffect, useRef } from "react";

/**
 * Run an effect exactly once on mount, including under React strict mode where
 * effects fire twice in development.
 *
 * Used instead of a bare `useEffect` with an empty dependency array so intent
 * is explicit at the call site: this is mount-only initialization, not a
 * subscription that should re-run.
 */
export function useMountEffect(effect: () => void): void {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    effect();
    // Mount-only by design; the effect identity is intentionally not tracked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
