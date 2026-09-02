import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { BOOK_RELEASE_DATE } from "@/lib/book-facts";

/**
 * Indexable URLs for /sitemap.xml.
 *
 * Kept out of the App Router so tests can import the list without loading a
 * route module, and so the XML route can stay a plain Response. The metadata
 * `sitemap.ts` convention 500s on the live host.
 */
export function getSitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${BOOK_RELEASE_DATE}T00:00:00.000Z`);

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${SITE_URL}/buy`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/press-kit`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/excerpt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/author`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/book-club`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/socials`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/developers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Builds the sitemap document crawlers fetch at /sitemap.xml. */
export function renderSitemapXml(): string {
  const urls = getSitemapEntries()
    .map((entry) => {
      const lastmod =
        entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : new Date(entry.lastModified ?? BOOK_RELEASE_DATE).toISOString();

      return [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        entry.changeFrequency
          ? `    <changefreq>${entry.changeFrequency}</changefreq>`
          : null,
        entry.priority !== undefined
          ? `    <priority>${entry.priority.toFixed(1)}</priority>`
          : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}
