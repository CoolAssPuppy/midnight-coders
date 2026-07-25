/**
 * Email design tokens, mirroring `src/app/buy/buy.css`.
 *
 * Duplicated rather than imported because email clients do not support CSS
 * custom properties: every value has to be inlined literally at render time.
 * If the purchase surface changes colour, change it here too.
 *
 * Per PRODUCT.md there are two voices. Menlo is the machine, and carries
 * prices, labels, status, and dates. Georgia is the book, and carries the
 * title and any quoted line. Hierarchy comes from the contrast between them.
 */

export const color = {
  midnight: "#0a1628",
  /** One step up from the background, for panels that need to separate. */
  surface: "#111f33",
  teal: "#4ec9b0",
  ink: "#d4d4d4",
  /** 8.65:1 on midnight. Never go below this for body text. */
  inkDim: "#b3b3b3",
  comment: "#6a9955",
  numeral: "#b5cea8",
  quote: "#dcdcaa",
  border: "rgba(255, 255, 255, 0.12)",
} as const;

export const font = {
  mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  serif: 'Georgia, "Times New Roman", serif',
} as const;

/**
 * Release day, as the buyer should see it.
 *
 * The pre-order emails state this plainly rather than burying it, because a
 * buyer who does not know the book is not out yet writes to support instead.
 */
export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Stripe reports totals in minor units. Buyers read major units. */
export function formatAmount(
  minorUnits: number | null | undefined,
  currency: string | null | undefined,
): string | null {
  if (minorUnits === null || minorUnits === undefined) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "usd").toUpperCase(),
  }).format(minorUnits / 100);
}
