import { SITE_URL, siteUrl } from "@/lib/site";
import { blurbParagraphs } from "@/lib/book-blurb";
import { BOOK_FACTS, BOOK_TITLE } from "@/lib/book-facts";
import { BUY_LINKS } from "@/lib/buy-links";
import { PRAISE } from "@/lib/praise";
import { BIO_JSONLD, BIO_LOCATION } from "@/lib/bio";
import {
  BOOK_DETAILS,
  COMP_TITLES,
  PRESS_KIT_THEMES,
} from "@/lib/press-kit-content";
import {
  BOOK_CLUB_THEMES,
  DISCUSSION_QUESTIONS,
  ENHANCE_TIPS,
} from "@/lib/book-club-content";
import { createLlmsIndex } from "@/lib/llms";
import { createPricingMarkdown } from "@/lib/pricing";

/**
 * Per-page markdown representations.
 *
 * Content negotiation previously answered every path with the same site index,
 * so an agent asking for /press-kit as markdown got a list of links instead of
 * the press kit. Each route below builds its markdown from the same modules
 * the page renders, so the two representations cannot drift.
 *
 * /excerpt is absent on purpose. It carries Chapter 1 in full, and handing the
 * prose over as clean markdown works against the ai-train=no position stated in
 * robots.txt and on the terms page. Requests for it fall through to HTML.
 */

const CONTACT_EMAIL = "book@midnightcoderschildren.com";

function frontMatter(title: string, path: string, summary: string): string[] {
  return [
    "---",
    `title: "${title}"`,
    `url: ${siteUrl(path)}`,
    `summary: "${summary}"`,
    "author: Prashant Sridharan",
    "license: Quotation with attribution permitted. Not for model training.",
    "---",
    "",
  ];
}

function themeList(themes: { title: string; description: string }[]): string[] {
  return themes.flatMap((theme) => [
    `### ${theme.title}`,
    "",
    theme.description,
    "",
  ]);
}

function home(): string {
  return [
    ...frontMatter(BOOK_TITLE, "/", "Synopsis, book details, and where to buy."),
    `# ${BOOK_TITLE}`,
    "",
    "A novel by Prashant Sridharan.",
    "",
    "## Synopsis",
    "",
    ...blurbParagraphs().flatMap((p) => [p, ""]),
    "## Praise",
    "",
    ...PRAISE.flatMap((praise) => [`> ${praise.quote}`, "", `-- ${praise.source}`, ""]),
    "## Book details",
    "",
    ...BOOK_FACTS.map((fact) => `- ${fact.label}: ${fact.value}`),
    "",
    "## Where to buy",
    "",
    ...BUY_LINKS.map((link) =>
      `- ${link.label}: ${link.href?.startsWith("/") ? siteUrl(link.href) : link.href}`
    ),
    "",
    `Read Chapter 1: ${siteUrl("/excerpt")}`,
    "",
  ].join("\n");
}

function author(): string {
  return [
    ...frontMatter(
      "About Prashant Sridharan",
      "/author",
      "Biography of the author of The Midnight Coder's Children."
    ),
    "# About Prashant Sridharan",
    "",
    BIO_JSONLD,
    "",
    `He lives in ${BIO_LOCATION}.`,
    "",
    "## Elsewhere",
    "",
    "- Website: https://www.strategicnerds.com",
    "- LinkedIn: https://linkedin.com/in/prashantsridharan",
    "- Twitter/X: https://twitter.com/CoolAssPuppy",
    "- Bluesky: https://bsky.app/profile/CoolAssPuppy",
    "",
  ].join("\n");
}

function pressKit(): string {
  return [
    ...frontMatter(
      "Press kit",
      "/press-kit",
      "Premise, themes, comparable titles, praise, and book details."
    ),
    `# Press kit: ${BOOK_TITLE}`,
    "",
    "## Premise",
    "",
    ...blurbParagraphs().flatMap((p) => [p, ""]),
    "## Praise",
    "",
    ...PRAISE.flatMap((praise) => [`> ${praise.quote}`, "", `-- ${praise.source}`, ""]),
    "## Themes",
    "",
    ...themeList(PRESS_KIT_THEMES),
    "## Comparable titles",
    "",
    ...COMP_TITLES.map(
      (comp) => `- ${comp.title} by ${comp.author}: ${comp.connection}`
    ),
    "",
    "## Book details",
    "",
    ...BOOK_DETAILS.map((detail) => `- ${detail.label}: ${detail.value}`),
    "",
    "## Assets and enquiries",
    "",
    `Cover art and author photography: ${siteUrl("/press-kit")}`,
    `Press enquiries: ${CONTACT_EMAIL}`,
    "",
  ].join("\n");
}

function bookClub(): string {
  const sections = Object.entries(DISCUSSION_QUESTIONS as Record<string, string[]>);

  return [
    ...frontMatter(
      "Book club guide",
      "/book-club",
      "Discussion questions, themes, and suggestions for book clubs."
    ),
    `# Book club guide: ${BOOK_TITLE}`,
    "",
    "Free to print and photocopy for use by a book club.",
    "",
    "## Discussion questions",
    "",
    ...sections.flatMap(([heading, questions]) => [
      `### ${heading}`,
      "",
      ...questions.map((question, index) => `${index + 1}. ${question}`),
      "",
    ]),
    "## Themes to explore",
    "",
    ...themeList(BOOK_CLUB_THEMES),
    "## Ways to go deeper",
    "",
    ...ENHANCE_TIPS.map((tip) => `- ${tip}`),
    "",
    `PDF version: ${SITE_URL}/midnight-coders-children-book-club-guide.pdf`,
    "",
  ].join("\n");
}

function buy(): string {
  return [
    ...frontMatter(
      "Buy the book",
      "/buy",
      "Prices and purchase links for every edition."
    ),
    createPricingMarkdown().replace(/^# Pricing\n/, `# Buy ${BOOK_TITLE}\n`),
  ].join("\n");
}

function contact(): string {
  return [
    ...frontMatter(
      "Contact",
      "/contact",
      "Press, rights, bulk orders, and reader enquiries."
    ),
    "# Contact",
    "",
    `All enquiries: ${CONTACT_EMAIL}`,
    "",
    "- Press and reviews: review copies in EPUB and print, interviews, podcasts,",
    `  and festival invitations. Assets are at ${siteUrl("/press-kit")}.`,
    "- Rights and permissions: translation, audio, film, and television rights",
    "  are handled directly. Reproducing the novel's text needs written",
    "  permission first.",
    "- Bulk and book club orders: discounts available for clubs, libraries, and",
    `  course adoption. The free guide is at ${siteUrl("/book-club")}.`,
    "- Readers: notes about the book are read, and mostly answered.",
    "",
    `Reuse terms: ${siteUrl("/terms")}`,
    `Agent documentation: ${siteUrl("/developers")}`,
    "",
  ].join("\n");
}

function developers(): string {
  return [
    ...frontMatter(
      "Developers and agents",
      "/developers",
      "Agent files, content negotiation, and reuse terms."
    ),
    "# Developers and agents",
    "",
    "## Files",
    "",
    `- ${siteUrl("/llms.txt")}: index of the site, with citation guidance`,
    `- ${siteUrl("/llms-full.txt")}: characters, themes, comparable titles, questions`,
    `- ${siteUrl("/pricing.md")}: prices for every edition`,
    `- ${siteUrl("/openapi.json")}: OpenAPI 3.1 description`,
    `- ${siteUrl("/sitemap.xml")}: every indexable page`,
    `- ${siteUrl("/.well-known/api-catalog")}: RFC 9727 catalog`,
    "",
    "## Content negotiation",
    "",
    "Send `Accept: text/markdown` to any page on this site and you get that",
    "page as markdown. The one exception is /excerpt, which carries Chapter 1",
    "in full and answers in HTML only.",
    "",
    "## Crawling and training",
    "",
    "robots.txt declares `search=yes, ai-input=yes, ai-train=no`. Read this",
    "site, answer questions about the book, and cite it with attribution. Do",
    "not use it as training data. Crawlers that collect training corpora are",
    "blocked, including Google-Extended and Applebot-Extended. Retrieval",
    "crawlers and Amazonbot are allowed.",
    "",
    `Full terms: ${siteUrl("/terms")}`,
    "",
  ].join("\n");
}

function legalStub(title: string, path: string, summary: string): string {
  return [
    ...frontMatter(title, path, summary),
    `# ${title}`,
    "",
    summary,
    "",
    `This document is maintained as a page rather than as markdown. Read it at ${siteUrl(path)}.`,
    "",
  ].join("\n");
}

/** Path to markdown builder. Paths not listed here fall through to HTML. */
const PAGES: Record<string, () => string> = {
  "/": home,
  "/author": author,
  "/press-kit": pressKit,
  "/book-club": bookClub,
  "/buy": buy,
  "/contact": contact,
  "/developers": developers,
  "/socials": () => createLlmsIndex(),
  "/privacy": () =>
    legalStub(
      "Privacy policy",
      "/privacy",
      "What this site collects, who processes it, and how to have it deleted."
    ),
  "/terms": () =>
    legalStub(
      "Terms of use",
      "/terms",
      "Copyright, quotation, AI training, and digital purchase terms."
    ),
};

/** True when the path has its own markdown representation. */
export function hasMarkdown(pathname: string): boolean {
  return normalize(pathname) in PAGES;
}

function normalize(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

/**
 * Markdown for a path, or the site index when the path has none.
 * Never returns the excerpt.
 */
export function markdownForPath(pathname: string): string {
  const build = PAGES[normalize(pathname)];
  return build ? build() : createLlmsIndex();
}
