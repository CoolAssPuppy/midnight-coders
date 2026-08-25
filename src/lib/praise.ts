/**
 * Editorial reviews for the book.
 *
 * Shared by the press kit page, buy page, and markdown pages.
 *
 * These blurbs have no numeric scores, so they must not be published as Google
 * Review structured data. Google requires a rating for review rich results.
 */

export interface Praise {
  quote: string;
  source: string;
}

export const PRAISE: Praise[] = [
  {
    quote:
      "As much an intriguing character study as it is a thriller. [A] compelling yarn.",
    source: "Kirkus Reviews",
  },
  {
    quote:
      "The Midnight Coder’s Children operates beyond action-packed scenarios to embrace personal lives and challenges impacted by choices. Sridharan’s tense thriller will delight readers.",
    source: "Midwest Book Review",
  },
  {
    quote:
      "In Sridharan’s brisk debut, trillions of dollars are in jeopardy, a global security crisis is escalating, and the key to stopping it all lies in the seemingly harmless recipe book of a now-deceased Indian woman. [A] brisk financial thriller buoyed by [an] emotional throughline. For fans of Kathy Wang’s Imposter Syndrome.",
    source: "BookLife",
  },
  {
    quote:
      "The Midnight Coder’s Children illuminates the casualties of technological convenience without guardrails: integrity, truth, and trust. Into this heart-pounding, lightning-fast tale of global financial crime in the age of AI, Sridharan deftly and elegantly weaves rich details of South Indian life, with finely-drawn and compelling characters who show us how to find our way back to integrity, through connection and care. We learn what is coded, not into a machine, but into a human being, through memory, experience, loss, and love.",
    source: "Dheepa R. Maturi, author of 108",
  },
];
