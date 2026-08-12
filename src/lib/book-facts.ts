/**
 * The book's bibliographic facts, in one place.
 *
 * These numbers appear in the JSON-LD graph, in llms.txt, in the press kit,
 * and in the crawlable homepage synopsis. Keeping them here means an agent
 * that reads two of those surfaces never sees two different answers.
 */

export interface BookFact {
  label: string;
  value: string;
}

export const BOOK_TITLE = "The Midnight Coder's Children";
export const BOOK_AUTHOR = "Prashant Sridharan";
export const BOOK_PUBLISHER = "Bodhi Press";
export const BOOK_ISBN = "9798999111128";
export const BOOK_RELEASE_DATE = "2026-09-15";
export const BOOK_PAGES = 348;

/** List price of the paperback, in USD. Matches the Offer in the JSON-LD. */
export const PAPERBACK_PRICE = "18.99";

/**
 * List price of the DRM-free EPUB sold direct through Stripe, in USD.
 * Stripe resolves the real price by lookup key at checkout, so this is the
 * published figure and Stripe is the authority if the two disagree.
 */
export const DIGITAL_PRICE = "14.99";

export const BOOK_FACTS: BookFact[] = [
  { label: "Title", value: BOOK_TITLE },
  { label: "Author", value: BOOK_AUTHOR },
  { label: "Publisher", value: BOOK_PUBLISHER },
  { label: "Release date", value: "15 September 2026" },
  { label: "Genre", value: "Upmarket techno-thriller and literary fiction" },
  { label: "Format", value: "Paperback and DRM-free EPUB" },
  { label: "Pages", value: String(BOOK_PAGES) },
  { label: "ISBN", value: BOOK_ISBN },
  { label: "Language", value: "English" },
];
