import { describe, expect, it } from "vitest";

import { hasMarkdown, markdownForPath } from "./page-markdown";
import { blurbParagraphs } from "./book-blurb";
import { PRAISE } from "./praise";
import { PRESS_KIT_THEMES } from "./press-kit-content";
import { DISCUSSION_QUESTIONS } from "./book-club-content";
import { DIGITAL_PRICE } from "./book-facts";
import sitemap from "../app/sitemap";

describe("per-page markdown", () => {
  it("gives each page its own content rather than the site index", () => {
    // The old behavior answered every path with llms.txt, so an agent asking
    // for /press-kit got a list of links instead of the press kit.
    const pressKit = markdownForPath("/press-kit");
    const bookClub = markdownForPath("/book-club");

    expect(pressKit).not.toBe(bookClub);
    expect(pressKit).toContain("# Press kit");
    expect(bookClub).toContain("# Book club guide");
  });

  it("carries the press kit's themes and comparable titles", () => {
    const markdown = markdownForPath("/press-kit");

    for (const theme of PRESS_KIT_THEMES) {
      expect(markdown).toContain(theme.title);
    }
    expect(markdown).toContain("Pachinko by Min Jin Lee");
    for (const praise of PRAISE) {
      expect(markdown).toContain(praise.source);
    }
  });

  it("carries every book club discussion question", () => {
    const markdown = markdownForPath("/book-club");

    for (const [heading, questions] of Object.entries(DISCUSSION_QUESTIONS)) {
      expect(markdown).toContain(heading);
      for (const question of questions) {
        expect(markdown).toContain(question);
      }
    }
  });

  it("prices the digital edition on the buy page", () => {
    expect(markdownForPath("/buy")).toContain(DIGITAL_PRICE);
  });

  it("puts the synopsis on the homepage", () => {
    const markdown = markdownForPath("/");

    for (const paragraph of blurbParagraphs()) {
      expect(markdown).toContain(paragraph);
    }
  });

  it("stamps every page with its URL and the reuse terms", () => {
    for (const path of ["/", "/author", "/press-kit", "/book-club", "/buy"]) {
      const markdown = markdownForPath(path);

      expect(markdown).toContain("author: Prashant Sridharan");
      expect(markdown).toContain("Not for model training");
      expect(markdown).toContain("midnightcoderschildren.com");
    }
  });

  it("never serves the excerpt, whatever it is asked for", () => {
    // The proxy refuses to negotiate on /excerpt, and this is the second lock:
    // even if a request reached the route, no builder returns chapter prose.
    expect(hasMarkdown("/excerpt")).toBe(false);

    const fallback = markdownForPath("/excerpt");
    expect(fallback).toContain("# The Midnight Coder's Children");
    expect(fallback).toContain("When to use this site");
  });

  it("treats a trailing slash as the same page", () => {
    expect(markdownForPath("/press-kit/")).toBe(markdownForPath("/press-kit"));
  });

  it("falls back to the site index for an unknown path", () => {
    expect(markdownForPath("/nope")).toContain("When to use this site");
  });

  it("covers every page in the sitemap except the excerpt", () => {
    const paths = sitemap()
      .map((entry) => new URL(entry.url).pathname)
      .filter((path) => path !== "/excerpt");

    for (const path of paths) {
      expect(hasMarkdown(path), `${path} should have markdown`).toBe(true);
    }
  });
});
