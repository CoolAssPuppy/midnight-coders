import { SITE_URL } from "@/lib/site";

/**
 * OpenAPI 3.1 description of the public, read-only endpoints.
 *
 * Only anonymous GET routes appear. The write routes (newsletter signup,
 * Stripe checkout, the Stripe webhook, the release-day cron, and the tokenised
 * download) are internal to this site's own flows, and publishing their
 * schemas would advertise an attack surface without giving an agent anything
 * useful to call. Their rate limits are published anyway, below.
 */

export interface DocumentedRateLimit {
  route: string;
  method: string;
  max: number;
  windowMinutes: number;
}

/** Mirrors the rate limiting applied in src/app/api. Update both together. */
export const RATE_LIMITS: DocumentedRateLimit[] = [
  { route: "/api/subscribe", method: "POST", max: 5, windowMinutes: 10 },
  { route: "/api/download/{token}", method: "GET", max: 30, windowMinutes: 10 },
  { route: "/api/stripe/checkout", method: "POST", max: 10, windowMinutes: 10 },
];

function description(): string {
  const rows = RATE_LIMITS.map(
    (limit) =>
      `| \`${limit.route}\` | ${limit.method} | ${limit.max} | ${limit.windowMinutes} min |`
  ).join("\n");

  return [
    "## Authentication",
    "",
    "None. Every endpoint described here is public and anonymous.",
    "",
    "## Rate limits",
    "",
    "The endpoints described here are statically generated and served from a",
    "CDN, so they are not rate limited. The site's other routes are, per client",
    "IP address, and their limits are published so you do not have to discover",
    "them by probing.",
    "",
    "| Route | Method | Requests | Window |",
    "| --- | --- | --- | --- |",
    rows,
    "",
    "## Reuse",
    "",
    "This site publishes a novel. Short quotations with attribution are",
    "welcome. Reproducing the prose is not, and robots.txt declares",
    "`ai-train=no`: the content may be used to answer and cite, and may not be",
    "used to train foundation models.",
  ].join("\n");
}

const markdownResponse = {
  description: "Markdown document.",
  content: { "text/markdown": { schema: { type: "string" } } },
} as const;

/** Builds the OpenAPI document served at /openapi.json. */
export function createOpenApiDocument() {
  return {
    openapi: "3.1.0",
    info: {
      title: "The Midnight Coder's Children",
      version: "1.0.0",
      summary:
        "Read-only access to the book information published on midnightcoderschildren.com.",
      description: description(),
      contact: {
        name: "Prashant Sridharan",
        url: `${SITE_URL}/contact`,
      },
      license: {
        name: "Copyright Prashant Sridharan. Quotation with attribution permitted.",
        url: `${SITE_URL}/terms`,
      },
    },
    servers: [{ url: SITE_URL, description: "Production" }],
    externalDocs: {
      description: "Developer and agent documentation",
      url: `${SITE_URL}/developers`,
    },
    tags: [{ name: "Agent files", description: "Plain-text files written for LLMs." }],
    paths: {
      "/llms.txt": {
        get: {
          tags: ["Agent files"],
          operationId: "getLlmsTxt",
          summary: "Index of the site, with guidance on how to cite it.",
          responses: { "200": markdownResponse },
        },
      },
      "/llms-full.txt": {
        get: {
          tags: ["Agent files"],
          operationId: "getLlmsFullTxt",
          summary:
            "Long-form context: characters, themes, comparable titles, discussion questions.",
          responses: { "200": markdownResponse },
        },
      },
      "/pricing.md": {
        get: {
          tags: ["Agent files"],
          operationId: "getPricing",
          summary: "Prices for the digital edition and the paperback.",
          responses: { "200": markdownResponse },
        },
      },
      "/api/md": {
        get: {
          tags: ["Agent files"],
          operationId: "getSiteMarkdown",
          summary: "The site as markdown.",
          description:
            "Also returned from / when the request sends `Accept: text/markdown` without `text/html`.",
          responses: { "200": markdownResponse },
        },
      },
      "/sitemap.xml": {
        get: {
          tags: ["Agent files"],
          operationId: "getSitemap",
          summary: "Every indexable page.",
          responses: {
            "200": {
              description: "Sitemap.",
              content: { "application/xml": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/.well-known/api-catalog": {
        get: {
          tags: ["Agent files"],
          operationId: "getApiCatalog",
          summary: "RFC 9727 catalog of the files above.",
          responses: {
            "200": {
              description: "RFC 9264 linkset.",
              content: {
                "application/linkset+json": { schema: { type: "object" } },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Error: {
          type: "object",
          required: ["error"],
          properties: {
            error: { type: "string", description: "Human-readable explanation." },
          },
        },
      },
    },
  };
}
