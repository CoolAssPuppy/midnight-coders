"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ScrollProgress {
  progress: number;
  scrollY: number;
  viewportHeight: number;
  documentHeight: number;
}

export function useScrollProgress(): ScrollProgress {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    viewportHeight: 0,
    documentHeight: 0,
  });

  const rafIdRef = useRef<number | null>(null);

  const calculateProgress = useCallback((): void => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - viewportHeight;
    const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

    setScrollProgress({
      progress,
      scrollY,
      viewportHeight,
      documentHeight,
    });
  }, []);

  useEffect(() => {
    const handleScroll = (): void => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(calculateProgress);
    };

    const handleResize = (): void => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(calculateProgress);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateProgress]);

  return scrollProgress;
}
