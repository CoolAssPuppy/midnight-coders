"use client";

import { memo } from "react";

interface HeroSectionProps {
  scrollProgress: number;
}

function HeroSectionComponent({
  scrollProgress,
}: HeroSectionProps): React.ReactElement | null {
  // Title visible from 0-15% scroll, fades out from 10-15%
  const fadeStart = 0.10;
  const fadeEnd = 0.15;

  const opacity =
    scrollProgress < fadeStart
      ? 1
      : scrollProgress > fadeEnd
        ? 0
        : 1 - (scrollProgress - fadeStart) / (fadeEnd - fadeStart);

  if (opacity <= 0) {
    return null;
  }

  return (
    <div
      className="flex flex-col items-center px-6 md:px-8"
      style={{
        opacity,
        transform: `translateY(${scrollProgress * -100}px)`,
        transition: "opacity 0.15s ease-out",
      }}
      aria-label="Book title"
    >
      <div className="text-left">
        <h1 className="flex flex-col leading-tight tracking-tight">
          <span
            className="text-white/80 mb-1"
            style={{ fontSize: "clamp(29px, 4vw, 41px)" }}
          >
            The
          </span>
          <span
            className="text-white font-normal"
            style={{ fontSize: "clamp(41px, 6vw, 65px)" }}
          >
            Midnight
          </span>
          <span
            className="text-white font-normal"
            style={{ fontSize: "clamp(41px, 6vw, 65px)" }}
          >
            Coder&apos;s
          </span>
          <span
            className="text-white font-normal"
            style={{ fontSize: "clamp(41px, 6vw, 65px)" }}
          >
            Children
          </span>
        </h1>
        <p
          className="mt-4 text-white/60"
          style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
        >
          by Prashant Sridharan
        </p>
        <p
          className="mt-6 text-sm md:text-base tracking-wide"
          style={{ color: "#fcde09" }}
        >
          (Coming September 2026)
        </p>
      </div>
    </div>
  );
}

export const HeroSection = memo(HeroSectionComponent);
