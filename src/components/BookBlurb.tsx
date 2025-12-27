"use client";

import { memo } from "react";

interface BookBlurbProps {
  scrollProgress: number;
}

const BOOK_BLURB_PARAGRAPHS = [
  "When a fast-moving cyberattack spreads across the global financial system, Sydney McEnroe, a brilliant systems engineer at the world's second largest bank, is pulled into a race against time.",

  "The only possible failsafe comes from an unlikely source, a handwritten recipe book left behind by Gayathri Ramaswamy, the late software engineer who helped build the financial industry's systems over decades. What appears to be a family recipe book reveals itself to be something else entirely-a cipher designed to be solved only by those who truly knew her.",

  "As Gayathri's surviving children, a United States Senator and a brilliant actor-musician, are drawn back into a past they thought they had already resolved, the story unfolds across one day of mounting crisis and a lifetime of quiet sacrifice. To save the world economy, they must work together to understand the complicated life of an immigrant, single mother, and tech industry pioneer.",

  "A propulsive, emotionally grounded thriller, The Midnight Coder's Children is a novel about trust, legacy, and the fragile bonds that hold both families and civilizations together.",
];

function BookBlurbComponent({
  scrollProgress,
}: BookBlurbProps): React.ReactElement | null {
  // Blurb fades in from 15-22%, visible from 22-45%, fades out from 45-52%
  const fadeInStart = 0.15;
  const fadeInEnd = 0.22;
  const fadeOutStart = 0.45;
  const fadeOutEnd = 0.52;

  let opacity = 0;

  if (scrollProgress < fadeInStart) {
    opacity = 0;
  } else if (scrollProgress < fadeInEnd) {
    opacity = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
  } else if (scrollProgress < fadeOutStart) {
    opacity = 1;
  } else if (scrollProgress < fadeOutEnd) {
    opacity = 1 - (scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  } else {
    opacity = 0;
  }

  if (opacity <= 0) {
    return null;
  }

  const translateY =
    scrollProgress < fadeInEnd
      ? (1 - opacity) * 30
      : scrollProgress > fadeOutStart
        ? (1 - opacity) * -30
        : 0;

  return (
    <div
      className="flex flex-col items-center px-6 md:px-8 max-w-2xl"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.15s ease-out",
      }}
      aria-label="Book description"
    >
      <div className="text-left">
        {BOOK_BLURB_PARAGRAPHS.map((paragraph, index) => (
          <p
            key={index}
            className="text-base md:text-lg leading-relaxed text-white/90 mb-6 last:mb-0"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export const BookBlurb = memo(BookBlurbComponent);
