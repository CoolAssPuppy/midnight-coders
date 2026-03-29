"use client";

import Image from "next/image";
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
      <Image
        src="/images/book-cover/Midnight Coders Children Cover 3D.png"
        alt="The Midnight Coder's Children by Prashant Sridharan"
        width={400}
        height={500}
        priority
        className="w-[250px] md:w-[350px] lg:w-[400px] h-auto drop-shadow-2xl"
      />
      <div className="mt-6 text-center">
        <h1 className="text-white text-sm md:text-base tracking-tight font-normal">
          The Midnight Coder&apos;s Children
        </h1>
        <p className="mt-1 text-white/60 text-[10px] md:text-xs">
          by Prashant Sridharan
        </p>
        <p
          className="mt-4 text-sm md:text-base tracking-wide"
          style={{ color: "#fcde09" }}
        >
          (Coming September 2026)
        </p>
      </div>
    </div>
  );
}

export const HeroSection = memo(HeroSectionComponent);
