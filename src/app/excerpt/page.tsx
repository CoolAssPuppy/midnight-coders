import type { Metadata } from "next";
import { ExcerptReader } from "@/components/ExcerptReader";
import { ExcerptTracker } from "@/components/ExcerptTracker";
import { SITE_URL, siteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Read Chapter 1 | The Midnight Coder's Children",
  description:
    "Read the opening chapter of The Midnight Coder's Children. Sydney McEnroe arrives at JR Eastman at 5:43 a.m. to discover the worst has happened.",
  alternates: {
    canonical: siteUrl("/excerpt"),
  },
  openGraph: {
    title: "Read Chapter 1 | The Midnight Coder's Children",
    description:
      "Read Chapter 1 of The Midnight Coder's Children by Prashant Sridharan.",
    url: siteUrl("/excerpt"),
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Read Chapter 1 | The Midnight Coder's Children",
    description:
      "Read the opening chapter. Sydney McEnroe arrives at JR Eastman at 5:43 a.m.",
  },
};

const baseUrl = SITE_URL;

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Midnight Coder's Children: Chapter 1 — 5:43 a.m.",
  description:
    "The opening chapter of The Midnight Coder's Children. Sydney McEnroe arrives at JR Eastman at 5:43 a.m. to discover the worst has happened.",
  image: `${baseUrl}/opengraph-image`,
  author: { "@id": `${baseUrl}/#author` },
  publisher: { "@id": `${baseUrl}/#organization` },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${baseUrl}/excerpt`,
  },
  isPartOf: { "@id": `${baseUrl}/#book` },
  inLanguage: "en",
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Excerpt", path: "/excerpt" },
]);

const combinedJsonLd = [articleJsonLd, breadcrumbJsonLd];

export default function ExcerptPage(): React.ReactElement {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedJsonLd),
        }}
      />
      <ExcerptTracker />
      <ExcerptReader />
    </main>
  );
}
