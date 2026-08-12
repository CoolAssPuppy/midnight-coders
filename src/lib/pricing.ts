import { SITE_URL } from "@/lib/site";
import { BUY_LINKS } from "@/lib/buy-links";
import {
  BOOK_ISBN,
  BOOK_PUBLISHER,
  BOOK_TITLE,
  DIGITAL_PRICE,
  PAPERBACK_PRICE,
} from "@/lib/book-facts";

/**
 * Machine-readable pricing, served at /pricing.md.
 *
 * Prices come from book-facts so this file, the JSON-LD offers, and the buy
 * page cannot drift apart. Stripe resolves the digital price by lookup key at
 * checkout, so it stays the authority for what a buyer is actually charged.
 */
export function createPricingMarkdown(): string {
  const retailers = BUY_LINKS.filter((link) => link.retailer && link.href)
    .map((link) => `- ${link.label.replace("Buy on ", "")}: ${link.href}`)
    .join("\n");

  return [
    "# Pricing",
    "",
    `> ${BOOK_TITLE} by Prashant Sridharan, published by ${BOOK_PUBLISHER}.`,
    "> Prices in United States dollars.",
    "",
    "## Digital edition",
    "",
    `- Price: ${DIGITAL_PRICE} USD`,
    "- Format: EPUB, DRM-free",
    "- Billing: One-time purchase",
    "- Availability: Pre-order, delivered 15 September 2026",
    `- Purchase: ${SITE_URL}/buy`,
    "- Sold direct by the author. Stripe sets the final price at checkout and",
    "  is the authority if it differs from the figure above.",
    "",
    "## Paperback",
    "",
    `- List price: ${PAPERBACK_PRICE} USD`,
    `- ISBN: ${BOOK_ISBN}`,
    "- Availability: Pre-order, released 15 September 2026",
    "- Retailers set their own prices, so the figure above is the list price",
    "  rather than what any given store charges.",
    "",
    retailers,
    "",
    "## Free",
    "",
    `- Chapter 1 in full: ${SITE_URL}/excerpt`,
    `- Book club discussion guide, including a PDF: ${SITE_URL}/book-club`,
    `- Press kit, including cover art and author photography: ${SITE_URL}/press-kit`,
    "",
    "## Contact",
    "",
    `Press, rights, and bulk order enquiries: ${SITE_URL}/contact`,
    "",
  ].join("\n");
}
