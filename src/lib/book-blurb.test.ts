import { describe, expect, it } from "vitest";

import { BOOK_BLURB, blurbParagraphs, getPlainText } from "./book-blurb";

describe("the synopsis that reaches crawlers", () => {
  /**
   * The homepage animation returns null at scroll position zero, which is the
   * state the server renders, so the book description was absent from the HTML
   * entirely. CrawlableSynopsis renders these paragraphs instead. If this ever
   * returns nothing, the homepage silently goes back to 67 words of text.
   */
  it("produces one plain paragraph per blurb paragraph", () => {
    const paragraphs = blurbParagraphs();

    expect(paragraphs).toHaveLength(BOOK_BLURB.length);
    expect(paragraphs.length).toBeGreaterThan(2);
  });

  it("carries real prose rather than empty strings", () => {
    for (const paragraph of blurbParagraphs()) {
      expect(paragraph.trim().length).toBeGreaterThan(40);
    }
  });

  it("names the protagonists, so the page is about something searchable", () => {
    const text = blurbParagraphs().join(" ");

    expect(text).toContain("Sydney McEnroe");
    expect(text).toContain("Gayathri Ramaswamy");
  });

  it("drops the syntax highlighting without dropping any characters", () => {
    const joined = blurbParagraphs().join(" ");

    expect(getPlainText()).toBe(joined);
    expect(joined).not.toContain("<");
  });
});
