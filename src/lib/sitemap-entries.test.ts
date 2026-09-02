import { describe, expect, it } from "vitest";
import { getSitemapEntries, renderSitemapXml } from "./sitemap-entries";
import { SITE_URL } from "./site";

describe("sitemap", () => {
  it("includes the purchase page and the trust pages", () => {
    const paths = getSitemapEntries().map((entry) => new URL(entry.url).pathname);

    expect(paths).toContain("/buy");
    expect(paths).toContain("/excerpt");
    expect(paths).toContain("/author");
    for (const page of ["/contact", "/privacy", "/terms"]) {
      expect(paths).toContain(page);
    }
  });

  it("renders XML that names the canonical host", () => {
    const xml = renderSitemapXml();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<urlset");
    expect(xml).toContain(`<loc>${SITE_URL}/buy</loc>`);
    expect(xml).not.toContain("undefined");
  });
});
