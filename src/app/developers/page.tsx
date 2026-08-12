import type { Metadata } from "next";
import Link from "next/link";
import { TextPage, TextSection, textLinkStyle } from "@/components/TextPage";
import { siteUrl } from "@/lib/site";
import { RATE_LIMITS } from "@/lib/openapi";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

const DESCRIPTION =
  "Agent files, endpoints, rate limits, and reuse terms for midnightcoderschildren.com.";

export const metadata: Metadata = {
  title: "Developers and agents | The Midnight Coder's Children",
  description: DESCRIPTION,
  alternates: {
    canonical: siteUrl("/developers"),
    languages: {
      "en-US": siteUrl("/developers"),
      "x-default": siteUrl("/developers"),
    },
  },
  openGraph: {
    title: "Developers and agents | The Midnight Coder's Children",
    description: DESCRIPTION,
    url: siteUrl("/developers"),
  },
};

const developersJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": siteUrl("/developers#page"),
  url: siteUrl("/developers"),
  headline: "Developers and agents",
  description: DESCRIPTION,
  inLanguage: "en-US",
  isPartOf: { "@id": siteUrl("/#website") },
  author: { "@id": siteUrl("/#author") },
  publisher: { "@id": siteUrl("/#organization") },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#endpoints", "#reuse-terms"],
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Developers", path: "/developers" },
]);

const ENDPOINTS: { path: string; returns: string; description: string }[] = [
  {
    path: "/llms.txt",
    returns: "text/markdown",
    description:
      "Index of the site, with guidance on when and how to cite it. Generated from the same data that builds the pages.",
  },
  {
    path: "/llms-full.txt",
    returns: "text/markdown",
    description:
      "Long-form context: characters, themes, comparable titles, and book club questions.",
  },
  {
    path: "/pricing.md",
    returns: "text/markdown",
    description: "Prices for the digital edition and the paperback.",
  },
  {
    path: "/openapi.json",
    returns: "application/json",
    description: "OpenAPI 3.1 description of everything on this page.",
  },
  {
    path: "/api/md",
    returns: "text/markdown",
    description: "The site as markdown. Also returned from any page that is sent Accept: text/markdown.",
  },
  {
    path: "/sitemap.xml",
    returns: "application/xml",
    description: "Every indexable page.",
  },
  {
    path: "/.well-known/api-catalog",
    returns: "application/linkset+json",
    description: "RFC 9727 catalog pointing at all of the above.",
  },
];

const MONO = "var(--font-mono)";

export default function DevelopersPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developersJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TextPage
        eyebrow="Developers"
        title="Developers and agents"
        intro="Everything about this book is readable without a key, an account, or a rendered page."
      >
        <TextSection heading="Files" id="endpoints">
          <ul className="space-y-4 list-none m-0 p-0">
            {ENDPOINTS.map((endpoint) => (
              <li key={endpoint.path}>
                <p style={{ color: "rgba(255,255,255,0.9)" }}>
                  <Link href={endpoint.path} style={textLinkStyle}>
                    {endpoint.path}
                  </Link>{" "}
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {endpoint.returns}
                  </span>
                </p>
                <p style={{ color: "rgba(255,255,255,0.6)" }}>
                  {endpoint.description}
                </p>
              </li>
            ))}
          </ul>
        </TextSection>

        <TextSection heading="Markdown instead of HTML">
          <p>
            Send <code>Accept: text/markdown</code> to any page and you get
            markdown back rather than the animated site, which is worth doing
            because the homepage is a scroll experience.
          </p>
          <pre
            className="overflow-x-auto text-xs p-4 rounded"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: MONO,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <code>{`curl -H "Accept: text/markdown" \\
  https://www.midnightcoderschildren.com/`}</code>
          </pre>
        </TextSection>

        <TextSection heading="Rate limits">
          <p>
            The files above are statically generated and served from a CDN, so
            they are not rate limited. The site&apos;s other routes are, per
            client IP address. Going over one returns <code>429</code>.
          </p>
          <ul className="space-y-2 list-none m-0 p-0">
            {RATE_LIMITS.map((limit) => (
              <li key={limit.route} style={{ color: "rgba(255,255,255,0.6)" }}>
                <code>{limit.route}</code> {limit.method}: {limit.max} requests
                per {limit.windowMinutes} minutes
              </li>
            ))}
          </ul>
        </TextSection>

        <TextSection heading="Crawling and training" id="reuse-terms">
          <p>
            <Link href="/robots.txt" style={textLinkStyle}>
              robots.txt
            </Link>{" "}
            declares <code>search=yes, ai-input=yes, ai-train=no</code>. Read
            this site, answer questions about the book, cite it with
            attribution. Do not use it as training data.
          </p>
          <p>
            This is a novel rather than marketing for something else, so the
            crawlers that collect training corpora are blocked, and that
            includes Google-Extended and Applebot-Extended. Retrieval crawlers
            and Amazonbot are allowed.
          </p>
          <p>
            Chapter 1 is published in full so readers can try the book. It is
            not published so it can be reproduced. The full position is on the{" "}
            <Link href="/terms" style={textLinkStyle}>
              terms page
            </Link>
            .
          </p>
        </TextSection>
      </TextPage>
    </>
  );
}
