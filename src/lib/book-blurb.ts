/**
 * The back-cover blurb, as the single source of truth for both presentations.
 *
 * The homepage renders this twice on purpose. `BookBlurb` paints it as
 * syntax-highlighted tokens driven by scroll position, and returns null until
 * the reader has scrolled, which means it is absent from the server-rendered
 * HTML. `blurbParagraphs()` gives the same text as plain prose so the synopsis
 * reaches crawlers, agents, and screen readers, none of which scroll.
 *
 * Edit the blurb here. Both presentations follow.
 */

export type SyntaxType =
  | "text"
  | "keyword"
  | "variable"
  | "string"
  | "function"
  | "type"
  | "comment"
  | "punctuation";

export interface Token {
  text: string;
  type: SyntaxType;
}

export type Paragraph = Token[];

export const BOOK_BLURB: Paragraph[] = [
  [
    { text: "It's a race against the clock to ", type: "text" },
    { text: "save", type: "keyword" },
    { text: " the ", type: "text" },
    { text: "US financial system", type: "type" },
    { text: " from ", type: "text" },
    { text: "total", type: "function" },
    { text: " collapse.", type: "text" },
  ],
  [
    { text: "Sydney McEnroe", type: "variable" },
    { text: " is the ", type: "text" },
    { text: "VP of engineering", type: "type" },
    { text: " for one of the world's most ", type: "text" },
    { text: "important", type: "function" },
    { text: " ", type: "text" },
    { text: "financial institutions", type: "type" },
    { text: ", and today is her worst nightmare. Her ", type: "text" },
    { text: "bank", type: "type" },
    { text: " is the victim of a ", type: "text" },
    { text: "vicious", type: "function" },
    { text: " cyberattack. She knows who to call. She knows what to do. What she hasn't accounted for? The key to ", type: "text" },
    { text: "restoring", type: "keyword" },
    { text: " ", type: "text" },
    { text: "security", type: "type" },
    { text: " is hidden in a ", type: "text" },
    { text: "former", type: "function" },
    { text: " employee's ", type: "text" },
    { text: "missing cipher", type: "string" },
    { text: ".", type: "punctuation" },
  ],
  [
    { text: "Decades earlier, ", type: "text" },
    { text: "tech pioneer", type: "type" },
    { text: " ", type: "text" },
    { text: "Gayathri Ramaswamy", type: "variable" },
    { text: " ", type: "text" },
    { text: "predicted", type: "keyword" },
    { text: " an attack of this magnitude while building the ", type: "text" },
    { text: "bank", type: "type" },
    { text: "'s systems, but no one listened. She ", type: "text" },
    { text: "engineered", type: "keyword" },
    { text: " a ", type: "text" },
    { text: "complex", type: "function" },
    { text: " ", type: "text" },
    { text: "safety protocol", type: "string" },
    { text: "\u2014one that could only be ", type: "text" },
    { text: "discovered", type: "keyword" },
    { text: " by those who truly understood the ", type: "text" },
    { text: "sacrifices", type: "type" },
    { text: " and ", type: "text" },
    { text: "strength", type: "type" },
    { text: " of an ", type: "text" },
    { text: "immigrant", type: "type" },
    { text: " and ", type: "text" },
    { text: "single mother", type: "type" },
    { text: ". As the cyberattack ", type: "text" },
    { text: "escalates", type: "keyword" },
    { text: ", ", type: "punctuation" },
    { text: "Sydney", type: "variable" },
    { text: " must ", type: "text" },
    { text: "track down", type: "keyword" },
    { text: " ", type: "text" },
    { text: "Gayathri", type: "variable" },
    { text: "'s surviving children in order to ", type: "text" },
    { text: "piece together", type: "keyword" },
    { text: " the mind and method of a ", type: "text" },
    { text: "misunderstood", type: "function" },
    { text: " ", type: "text" },
    { text: "genius", type: "type" },
    { text: "\u2014before time runs out and the ", type: "text" },
    { text: "global economy", type: "type" },
    { text: " is ", type: "text" },
    { text: "catapulted", type: "keyword" },
    { text: " into chaos.", type: "text" },
  ],
  [
    { text: "A ", type: "text" },
    { text: "propulsive", type: "function" },
    { text: ", ", type: "punctuation" },
    { text: "emotionally grounded", type: "function" },
    { text: " ", type: "text" },
    { text: "techno-thriller", type: "type" },
    { text: ", ", type: "punctuation" },
    { text: "The Midnight Coder's Children", type: "string" },
    { text: " is a novel about the ", type: "text" },
    { text: "legacies", type: "type" },
    { text: " we make for ourselves, the ", type: "text" },
    { text: "fragile", type: "function" },
    { text: " trust that holds ", type: "text" },
    { text: "families", type: "type" },
    { text: " and ", type: "text" },
    { text: "civilizations", type: "type" },
    { text: " together, and the ", type: "text" },
    { text: "extraordinary", type: "function" },
    { text: " systems built\u2014byte by byte\u2014by ", type: "text" },
    { text: "overlooked", type: "function" },
    { text: " people.", type: "text" },
  ],
];

/** One flat string per paragraph, with the token styling dropped. */
export function blurbParagraphs(): string[] {
  return BOOK_BLURB.map((paragraph) =>
    paragraph.map((token) => token.text).join("")
  );
}

/** The whole blurb as one string. Used for letter matching in the animation. */
export function getPlainText(paragraphs: Paragraph[] = BOOK_BLURB): string {
  return paragraphs.map((p) => p.map((t) => t.text).join("")).join(" ");
}
