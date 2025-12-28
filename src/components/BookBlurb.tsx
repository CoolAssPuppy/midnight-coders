"use client";

import { memo, useMemo } from "react";
import { SIGNUP_HEADLINE } from "./EmailSignup";

interface BookBlurbProps {
  scrollProgress: number;
}

type SyntaxType =
  | "text"
  | "keyword"
  | "variable"
  | "string"
  | "function"
  | "type"
  | "comment"
  | "punctuation";

interface Token {
  text: string;
  type: SyntaxType;
}

type Paragraph = Token[];

const SYNTAX_COLORS: Record<SyntaxType, string> = {
  text: "#D4D4D4",
  keyword: "#569CD6",
  variable: "#9CDCFE",
  string: "#CE9178",
  function: "#DCDCAA",
  type: "#4EC9B0",
  comment: "#6A9955",
  punctuation: "#D4D4D4",
};

// Structured blurb with grammar-based syntax highlighting:
// - variable (light blue): Character names (proper nouns)
// - type (teal): Roles, professions, institutions, themes
// - string (orange): Book title, key objects, emphasized phrases
// - function (yellow): Adjectives
// - keyword (blue): Key action verbs
// - text (white): Regular prose
const BOOK_BLURB: Paragraph[] = [
  [
    { text: "When a ", type: "text" },
    { text: "fast-moving", type: "function" },
    { text: " cyberattack ", type: "text" },
    { text: "spreads", type: "keyword" },
    { text: " across the ", type: "text" },
    { text: "global financial system", type: "type" },
    { text: ", ", type: "punctuation" },
    { text: "Sydney McEnroe", type: "variable" },
    { text: ", a ", type: "text" },
    { text: "brilliant", type: "function" },
    { text: " ", type: "text" },
    { text: "systems engineer", type: "type" },
    { text: " at the world's second largest bank, is ", type: "text" },
    { text: "pulled", type: "keyword" },
    { text: " into a race against time.", type: "text" },
  ],
  [
    { text: "The only possible failsafe ", type: "text" },
    { text: "comes", type: "keyword" },
    { text: " from an ", type: "text" },
    { text: "unlikely", type: "function" },
    { text: " source: a ", type: "text" },
    { text: "handwritten recipe book", type: "string" },
    { text: " left behind by ", type: "text" },
    { text: "Gayathri Ramaswamy", type: "variable" },
    { text: ", the ", type: "text" },
    { text: "late", type: "function" },
    { text: " ", type: "text" },
    { text: "software engineer", type: "type" },
    { text: " who ", type: "text" },
    { text: "helped build", type: "keyword" },
    { text: " the financial industry's systems over decades. What appears to be a family recipe book ", type: "text" },
    { text: "reveals", type: "keyword" },
    { text: " itself to be something else entirely", type: "text" },
    { text: "—", type: "punctuation" },
    { text: "a cipher ", type: "text" },
    { text: "designed", type: "keyword" },
    { text: " to be solved only by those who truly knew her.", type: "text" },
  ],
  [
    { text: "As ", type: "text" },
    { text: "Gayathri", type: "variable" },
    { text: "'s ", type: "text" },
    { text: "surviving", type: "function" },
    { text: " children", type: "text" },
    { text: "—", type: "punctuation" },
    { text: "a ", type: "text" },
    { text: "United States Senator", type: "type" },
    { text: " and a ", type: "text" },
    { text: "brilliant", type: "function" },
    { text: " ", type: "text" },
    { text: "actor-musician", type: "type" },
    { text: "—", type: "punctuation" },
    { text: "are ", type: "text" },
    { text: "drawn", type: "keyword" },
    { text: " back into a past they thought they had already resolved, the story ", type: "text" },
    { text: "unfolds", type: "keyword" },
    { text: " across ", type: "text" },
    { text: "one day", type: "string" },
    { text: " of ", type: "text" },
    { text: "mounting", type: "function" },
    { text: " crisis and ", type: "text" },
    { text: "a lifetime", type: "string" },
    { text: " of ", type: "text" },
    { text: "quiet", type: "function" },
    { text: " sacrifice. To ", type: "text" },
    { text: "save", type: "keyword" },
    { text: " the ", type: "text" },
    { text: "world economy", type: "type" },
    { text: ", they must ", type: "text" },
    { text: "work together", type: "keyword" },
    { text: " to understand the ", type: "text" },
    { text: "complicated", type: "function" },
    { text: " life of an ", type: "text" },
    { text: "immigrant", type: "type" },
    { text: ", ", type: "punctuation" },
    { text: "single mother", type: "type" },
    { text: ", and ", type: "text" },
    { text: "tech industry pioneer", type: "type" },
    { text: ".", type: "punctuation" },
  ],
  [
    { text: "A ", type: "text" },
    { text: "propulsive", type: "function" },
    { text: ", ", type: "punctuation" },
    { text: "emotionally grounded", type: "function" },
    { text: " ", type: "text" },
    { text: "thriller", type: "type" },
    { text: ", ", type: "punctuation" },
    { text: "The Midnight Coder's Children", type: "string" },
    { text: " is a novel about ", type: "text" },
    { text: "trust", type: "type" },
    { text: ", ", type: "punctuation" },
    { text: "legacy", type: "type" },
    { text: ", and the ", type: "text" },
    { text: "fragile", type: "function" },
    { text: " bonds that ", type: "text" },
    { text: "hold", type: "keyword" },
    { text: " both families and civilizations together.", type: "text" },
  ],
];

// Convert structured blurb to plain text for letter matching
function getPlainText(paragraphs: Paragraph[]): string {
  return paragraphs
    .map((p) => p.map((t) => t.text).join(""))
    .join(" ");
}

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
function findMatchingIndices(
  blurbText: string,
  targetText: string
): Set<number> {
  const matchingIndices = new Set<number>();
  const targetChars = targetText.toLowerCase().split("").filter(c => c !== " ");
  const usedIndices = new Set<number>();
  const blurbLength = blurbText.length;

  targetChars.forEach((targetChar, targetIndex) => {
    const possiblePositions: number[] = [];
    for (let i = 0; i < blurbLength; i++) {
      if (!usedIndices.has(i) && blurbText[i].toLowerCase() === targetChar) {
        possiblePositions.push(i);
      }
    }

    if (possiblePositions.length === 0) return;

    const idealPosition = (targetIndex / targetChars.length) * blurbLength;
    const randomOffset = ((targetIndex * 137) % 100) / 100;
    const searchRadius = blurbLength * 0.15;

    let bestPosition = possiblePositions[0];
    let bestScore = Infinity;

    for (const pos of possiblePositions) {
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
  syntaxColor: string;
  isHighlighted: boolean;
  transitionProgress: number;
}

function StyledChar({ char, syntaxColor, isHighlighted, transitionProgress }: StyledCharProps): React.ReactElement {
  if (char === " ") {
    return <span> </span>;
  }

  const showDiacritic = isHighlighted && transitionProgress > 0.3 && transitionProgress < 0.9;
  const displayChar = showDiacritic ? getDiacriticVersion(char) : char;

  let color: string;
  let opacity: number;

  if (isHighlighted) {
    // Transition from syntax color to yellow
    const yellowIntensity = Math.min(transitionProgress * 2, 1);
    if (yellowIntensity < 1) {
      // Interpolate between syntax color and yellow
      color = syntaxColor;
      opacity = 1;
    } else {
      color = "#fcde09";
      opacity = 0.9;
    }
  } else {
    // Keep syntax color, fade out
    color = syntaxColor;
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

interface TokenRendererProps {
  token: Token;
  globalStartIndex: number;
  matchingIndices: Set<number>;
  transitionProgress: number;
  isInTransition: boolean;
}

function TokenRenderer({
  token,
  globalStartIndex,
  matchingIndices,
  transitionProgress,
  isInTransition,
}: TokenRendererProps): React.ReactElement {
  const syntaxColor = SYNTAX_COLORS[token.type];

  if (!isInTransition) {
    return (
      <span style={{ color: syntaxColor }}>
        {token.text}
      </span>
    );
  }

  return (
    <>
      {token.text.split("").map((char, i) => {
        const globalIndex = globalStartIndex + i;
        const isHighlighted = matchingIndices.has(globalIndex);
        return (
          <StyledChar
            key={i}
            char={char}
            syntaxColor={syntaxColor}
            isHighlighted={isHighlighted}
            transitionProgress={transitionProgress}
          />
        );
      })}
    </>
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

  // Calculate transition progress (0-1 during 40-70%)
  const transitionProgress =
    scrollProgress <= transitionStart
      ? 0
      : scrollProgress >= transitionEnd
        ? 1
        : (scrollProgress - transitionStart) / (transitionEnd - transitionStart);

  // Get plain text and matching indices
  const fullText = useMemo(() => getPlainText(BOOK_BLURB), []);
  const matchingIndices = useMemo(
    () => findMatchingIndices(fullText, SIGNUP_HEADLINE),
    [fullText]
  );

  // Pre-calculate paragraph and token start indices
  const paragraphMeta = useMemo(() => {
    const meta: { paragraphStart: number; tokenStarts: number[] }[] = [];
    let currentIndex = 0;

    for (const paragraph of BOOK_BLURB) {
      const tokenStarts: number[] = [];
      for (const token of paragraph) {
        tokenStarts.push(currentIndex);
        currentIndex += token.text.length;
      }
      meta.push({ paragraphStart: tokenStarts[0] || currentIndex, tokenStarts });
      currentIndex += 1; // space between paragraphs
    }

    return meta;
  }, []);

  if (baseOpacity <= 0) {
    return null;
  }

  const translateY =
    scrollProgress < fadeInEnd
      ? (1 - baseOpacity) * 30
      : 0;

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
      <div
        className="text-left rounded-lg p-8"
        style={{
          backgroundColor: "rgba(30, 30, 30, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Code window header */}
        <div
          className="flex items-center gap-2 mb-6 pb-4"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#ff5f56" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#ffbd2e" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#27c93f" }}
          />
          <span
            className="ml-4 text-xs"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            what-its-about.tsx
          </span>
        </div>

        {BOOK_BLURB.map((paragraph, pIndex) => {
          const { tokenStarts } = paragraphMeta[pIndex];

          return (
            <p
              key={pIndex}
              className="text-sm md:text-base leading-relaxed mb-6 last:mb-0"
            >
              {paragraph.map((token, tIndex) => (
                <TokenRenderer
                  key={tIndex}
                  token={token}
                  globalStartIndex={tokenStarts[tIndex]}
                  matchingIndices={matchingIndices}
                  transitionProgress={transitionProgress}
                  isInTransition={isInTransition}
                />
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export const BookBlurb = memo(BookBlurbComponent);
