"use client";

import { useEffect, useState } from "react";

import { PRAISE } from "@/lib/praise";
import { getNextPraiseIndex } from "@/lib/praise-rotation";

const QUOTE_INTERVAL_MS = 8_000;
const QUOTE_SWAP_MS = 160;
const GLITCH_DURATION_MS = 480;
const BOOKLIFE_INDEX = Math.max(
  0,
  PRAISE.findIndex((praise) => praise.source === "BookLife"),
);

export function RotatingPraise(): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(BOOKLIFE_INDEX);
  const [isGlitching, setIsGlitching] = useState(false);
  const currentPraise = PRAISE[currentIndex];

  useEffect(() => {
    let swapTimeout: ReturnType<typeof setTimeout> | undefined;
    let settleTimeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      setIsGlitching(true);

      swapTimeout = setTimeout(() => {
        setCurrentIndex((index) => getNextPraiseIndex(index, PRAISE.length));
      }, QUOTE_SWAP_MS);

      settleTimeout = setTimeout(() => {
        setIsGlitching(false);
      }, GLITCH_DURATION_MS);
    }, QUOTE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(swapTimeout);
      clearTimeout(settleTimeout);
    };
  }, []);

  return (
    <blockquote
      className={`buy__quote${isGlitching ? " buy__quote--glitching" : ""}`}
    >
      <p data-quote={currentPraise.quote}>{currentPraise.quote}</p>
      <cite>{currentPraise.source}</cite>
    </blockquote>
  );
}
