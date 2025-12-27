"use client";

import { memo, useMemo } from "react";
import { SIGNUP_HEADLINE } from "./EmailSignup";

interface BookBlurbProps {
  scrollProgress: number;
}

const BOOK_BLURB_PARAGRAPHS = [
  "When a fast-moving cyberattack spreads across the global financial system, Sydney McEnroe, a brilliant systems engineer at the world's second largest bank, is pulled into a race against time.",

  "The only possible failsafe comes from an unlikely source, a handwritten recipe book left behind by Gayathri Ramaswamy, the late software engineer who helped build the financial industry's systems over decades. What appears to be a family recipe book reveals itself to be something else entirely-a cipher designed to be solved only by those who truly knew her.",

  "As Gayathri's surviving children, a United States Senator and a brilliant actor-musician, are drawn back into a past they thought they had already resolved, the story unfolds across one day of mounting crisis and a lifetime of quiet sacrifice. To save the world economy, they must work together to understand the complicated life of an immigrant, single mother, and tech industry pioneer.",

  "A propulsive, emotionally grounded thriller, The Midnight Coder's Children is a novel about trust, legacy, and the fragile bonds that hold both families and civilizations together.",
];

// Map of characters to their diacritic variants
const DIACRITIC_MAP: Record<string, string> = {
  a: "\u00e0", A: "\u00c0",
  b: "\u0180", B: "\u0181",
  c: "\u00e7", C: "\u00c7",
  d: "\u010f", D: "\u010e",
  e: "\u00e8", E: "\u00c8",
  f: "\u0192", F: "\u0191",
  g: "\u011f", G: "\u011e",
  h: "\u0127", H: "\u0126",
  i: "\u00ec", I: "\u00cc",
  k: "\u0137", K: "\u0136",
  l: "\u013a", L: "\u0139",
  n: "\u00f1", N: "\u00d1",
  o: "\u00f2", O: "\u00d2",
  r: "\u0155", R: "\u0154",
  s: "\u015b", S: "\u015a",
  t: "\u0163", T: "\u0162",
  u: "\u00f9", U: "\u00d9",
  w: "\u0175", W: "\u0174",
  y: "\u00fd", Y: "\u00dd",
};

function getDiacriticVersion(char: string): string {
  return DIACRITIC_MAP[char] || char;
}

// Find which character indices in the blurb should be highlighted
// Spreads matching letters throughout the text for visual effect
function findMatchingIndices(
  blurbText: string,
  targetText: string
): Set<number> {
  const matchingIndices = new Set<number>();
  const targetChars = targetText.toLowerCase().split("").filter(c => c !== " ");
  const usedIndices = new Set<number>();
  const blurbLength = blurbText.length;

  // For each target character, find all possible positions
  // Then select one that's spread out through the text
  targetChars.forEach((targetChar, targetIndex) => {
    // Find all positions where this character appears
    const possiblePositions: number[] = [];
    for (let i = 0; i < blurbLength; i++) {
      if (!usedIndices.has(i) && blurbText[i].toLowerCase() === targetChar) {
        possiblePositions.push(i);
      }
    }

    if (possiblePositions.length === 0) return;

    // Calculate ideal position (spread evenly through text)
    const idealPosition = (targetIndex / targetChars.length) * blurbLength;

    // Find the position closest to the ideal that's also somewhat random
    // Use a seeded pseudo-random offset based on targetIndex
    const randomOffset = ((targetIndex * 137) % 100) / 100; // 0-1 range
    const searchRadius = blurbLength * 0.15; // Search within 15% of text length

    let bestPosition = possiblePositions[0];
    let bestScore = Infinity;

    for (const pos of possiblePositions) {
      // Score based on distance from ideal position, with some randomness
      const distance = Math.abs(pos - idealPosition);
      const randomBonus = randomOffset * searchRadius;
      const score = distance - randomBonus + (pos < idealPosition ? searchRadius * 0.5 : 0);

      if (score < bestScore) {
        bestScore = score;
        bestPosition = pos;
      }
    }

    matchingIndices.add(bestPosition);
    usedIndices.add(bestPosition);
  });

  return matchingIndices;
}

interface StyledCharProps {
  char: string;
  isHighlighted: boolean;
  transitionProgress: number;
}

function StyledChar({ char, isHighlighted, transitionProgress }: StyledCharProps): React.ReactElement {
  if (char === " ") {
    return <span> </span>;
  }

  const showDiacritic = isHighlighted && transitionProgress > 0.3 && transitionProgress < 0.9;
  const displayChar = showDiacritic ? getDiacriticVersion(char) : char;

  // Highlighted letters: fade to yellow
  // Non-highlighted letters: fade out
  let color: string;
  let opacity: number;

  if (isHighlighted) {
    // Transition from white to yellow
    const yellowIntensity = Math.min(transitionProgress * 2, 1);
    const r = Math.round(255 + (252 - 255) * yellowIntensity);
    const g = Math.round(255 + (222 - 255) * yellowIntensity);
    const b = Math.round(255 + (9 - 255) * yellowIntensity);
    color = `rgb(${r}, ${g}, ${b})`;
    opacity = 0.9;
  } else {
    // Fade out non-highlighted
    color = "rgba(255, 255, 255, 0.9)";
    opacity = Math.max(0, 1 - transitionProgress * 1.5);
  }

  const textShadow = isHighlighted && transitionProgress > 0.2
    ? `0 0 ${8 * transitionProgress}px rgba(252, 222, 9, ${transitionProgress * 0.5})`
    : "none";

  return (
    <span
      style={{
        color,
        opacity,
        textShadow,
        transition: "color 0.15s ease-out, opacity 0.15s ease-out",
      }}
    >
      {displayChar}
    </span>
  );
}

function BookBlurbComponent({
  scrollProgress,
}: BookBlurbProps): React.ReactElement | null {
  // Blurb fades in from 15-22%, visible from 22-40%, special transition from 40-70%
  const fadeInStart = 0.15;
  const fadeInEnd = 0.22;
  const transitionStart = 0.40;
  const transitionEnd = 0.70;

  // Calculate base opacity
  let baseOpacity = 0;
  if (scrollProgress < fadeInStart) {
    baseOpacity = 0;
  } else if (scrollProgress < fadeInEnd) {
    baseOpacity = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
  } else if (scrollProgress < transitionEnd) {
    baseOpacity = 1;
  } else {
    baseOpacity = 0;
  }

  // Calculate transition progress (0-1 during 45-52%)
  const transitionProgress =
    scrollProgress <= transitionStart
      ? 0
      : scrollProgress >= transitionEnd
        ? 1
        : (scrollProgress - transitionStart) / (transitionEnd - transitionStart);

  // Combine paragraphs for index calculation
  const fullText = useMemo(() => BOOK_BLURB_PARAGRAPHS.join(" "), []);

  // Find matching indices
  const matchingIndices = useMemo(
    () => findMatchingIndices(fullText, SIGNUP_HEADLINE),
    [fullText]
  );

  // Pre-calculate paragraph start indices
  const paragraphStartIndices = useMemo(() => {
    const indices: number[] = [];
    let currentIndex = 0;
    for (const paragraph of BOOK_BLURB_PARAGRAPHS) {
      indices.push(currentIndex);
      currentIndex += paragraph.length + 1; // +1 for space between paragraphs
    }
    return indices;
  }, []);

  if (baseOpacity <= 0) {
    return null;
  }

  const translateY =
    scrollProgress < fadeInEnd
      ? (1 - baseOpacity) * 30
      : 0;

  // During transition, we render character by character
  const isInTransition = transitionProgress > 0;

  return (
    <div
      className="flex flex-col items-center px-6 md:px-8 max-w-2xl"
      style={{
        opacity: baseOpacity,
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.15s ease-out",
      }}
      aria-label="Book description"
    >
      <div className="text-left">
        {BOOK_BLURB_PARAGRAPHS.map((paragraph, pIndex) => {
          const paragraphStartIndex = paragraphStartIndices[pIndex];

          const content = isInTransition ? (
            paragraph.split("").map((char, cIndex) => {
              const charGlobalIndex = paragraphStartIndex + cIndex;
              const isHighlighted = matchingIndices.has(charGlobalIndex);
              return (
                <StyledChar
                  key={cIndex}
                  char={char}
                  isHighlighted={isHighlighted}
                  transitionProgress={transitionProgress}
                />
              );
            })
          ) : (
            paragraph
          );

          return (
            <p
              key={pIndex}
              className="text-base md:text-lg leading-relaxed text-white/90 mb-6 last:mb-0"
              style={{
                fontFamily: '"Times New Roman", Times, serif',
              }}
            >
              {content}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export const BookBlurb = memo(BookBlurbComponent);
