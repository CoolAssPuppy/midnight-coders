import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import RootLayout from "./layout";

describe("site structured data", () => {
  it("does not classify unrated editorial blurbs as reviews", () => {
    const html = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement("main", null, "Page content"),
      ),
    );

    expect(html).not.toContain('"@type":"Review"');
  });

  it("points the author at /author and does not name developer marketing", () => {
    const html = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement("main", null, "Page content"),
      ),
    );

    expect(html).toContain("https://www.midnightcoderschildren.com/author");
    expect(html).not.toContain("https://www.strategicnerds.com");
    expect(html).not.toContain("Developer Marketing");
    expect(html).toContain('"@type":"Book"');
    expect(html).toContain("9798999111128");
  });
});
