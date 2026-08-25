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
});
