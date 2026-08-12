import { SITE_URL } from "@/lib/site";

/**
 * Crawler rules and Content-Signal directives for robots.txt.
 *
 * The file previously carried a single wildcard rule, which allowed everything
 * without saying anything. These rules separate the two kinds of AI crawler:
 * retrieval bots that fetch a page to answer a question and cite it, and
 * training bots that collect corpora. The first group is how a book gets
 * recommended, so it is allowed. The second is not.
 *
 * Content-Signal states the usage preference alongside the access rules:
 *   search=yes    - allow indexing for search and retrieval
 *   ai-input=yes  - allow citation in AI answers with attribution
 *   ai-train=no   - do not use to train foundation models
 */

export type Rule = {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
};

const PRIVATE_PATHS = ["/api/", "/ads/"];

export const RULES: Rule[] = [
  { userAgent: "*", allow: ["/"], disallow: PRIVATE_PATHS },

  // Retrieval crawlers: user-triggered fetches and search indexing. These are
  // the ones that put a book in front of somebody asking for a recommendation.
  { userAgent: "OAI-SearchBot", allow: ["/"], disallow: PRIVATE_PATHS },
  { userAgent: "ChatGPT-User", allow: ["/"], disallow: PRIVATE_PATHS },
  { userAgent: "Claude-User", allow: ["/"], disallow: PRIVATE_PATHS },
  { userAgent: "Claude-SearchBot", allow: ["/"], disallow: PRIVATE_PATHS },
  { userAgent: "PerplexityBot", allow: ["/"], disallow: PRIVATE_PATHS },
  { userAgent: "Perplexity-User", allow: ["/"], disallow: PRIVATE_PATHS },

  // Amazonbot feeds Alexa and Rufus. This book sells on Amazon, so this is the
  // crawler sitting closest to a purchase, and it is retrieval rather than
  // training. Allowed.
  { userAgent: "Amazonbot", allow: ["/"], disallow: PRIVATE_PATHS },

  // Google-Extended and Applebot-Extended are the training opt-outs for Google
  // and Apple. Blocked here, unlike on strategicnerds.com, because the novel is
  // the product rather than marketing for something else, and Chapter 1 is
  // published in full at /excerpt. Losing Gemini and Apple Intelligence
  // grounding is the price of keeping the fiction out of two training
  // pipelines.
  { userAgent: "Google-Extended", disallow: ["/"] },
  { userAgent: "Applebot-Extended", disallow: ["/"] },

  // Training crawlers: blocked to match Content-Signal ai-train=no.
  { userAgent: "GPTBot", disallow: ["/"] },
  { userAgent: "ClaudeBot", disallow: ["/"] },
  { userAgent: "anthropic-ai", disallow: ["/"] },
  { userAgent: "Claude-Web", disallow: ["/"] },
  { userAgent: "CCBot", disallow: ["/"] },
  { userAgent: "Bytespider", disallow: ["/"] },
  { userAgent: "Meta-ExternalAgent", disallow: ["/"] },
  { userAgent: "GrokBot", disallow: ["/"] },
  { userAgent: "xAI-Grok", disallow: ["/"] },

  // Commercial SEO scrapers. No benefit to an author, real bandwidth cost.
  { userAgent: "PetalBot", disallow: ["/"] },
  { userAgent: "AhrefsBot", disallow: ["/"] },
  { userAgent: "SemrushBot", disallow: ["/"] },
];

function renderRule(rule: Rule): string {
  const lines = [`User-agent: ${rule.userAgent}`];
  for (const path of rule.allow ?? []) lines.push(`Allow: ${path}`);
  for (const path of rule.disallow ?? []) lines.push(`Disallow: ${path}`);
  return lines.join("\n");
}

/** Renders the full robots.txt body. */
export function renderRobotsTxt(): string {
  return [
    "# Content usage preferences (https://contentsignals.org/)",
    "# search=yes: allow indexing for search and retrieval",
    "# ai-input=yes: allow citation in AI answers with attribution",
    "# ai-train=no: do not use to train foundation models",
    "Content-Signal: search=yes, ai-input=yes, ai-train=no",
    `# AI content index: ${SITE_URL}/llms.txt`,
    `# Pricing for agents: ${SITE_URL}/pricing.md`,
    `# API description: ${SITE_URL}/openapi.json`,
    "",
    RULES.map(renderRule).join("\n\n"),
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}
