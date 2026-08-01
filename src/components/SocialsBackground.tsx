"use client";

import { GlitchEffect } from "@/components/GlitchEffect";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * The homepage background, wired to this page's scroll.
 *
 * The assets themselves are rendered on a still version of this treatment, so
 * running the live one behind them lets a visitor see the post sitting in the
 * world it was cut from.
 */
export function SocialsBackground(): React.ReactElement {
  const { progress } = useScrollProgress();

  return <GlitchEffect scrollProgress={progress} />;
}
