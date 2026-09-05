import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { SOCIAL_POSTS } from "./social-posts.generated";

function expectRenditionsOnDisk(post: (typeof SOCIAL_POSTS)[number]): void {
  expect(post.renditions).toHaveLength(3);

  for (const rendition of post.renditions) {
    for (const file of [rendition.png, rendition.jpg, rendition.mp4]) {
      const relativeFile = file.split("?")[0];
      expect(existsSync(path.join(process.cwd(), "public", relativeFile))).toBe(
        true,
      );
    }
  }
}

describe("social post assets", () => {
  it("includes downloadable Kirkus cards in every size and format", () => {
    const post = SOCIAL_POSTS.find(({ id }) => id === "07-praise-kirkus");

    expect(post?.headline).toBe(
      "As much an intriguing character study as it is a thriller. [A] compelling yarn.",
    );
    expectRenditionsOnDisk(post!);
  });

  it("includes the Barnes & Noble promotion with PREORDER25 and a buy link", () => {
    const post = SOCIAL_POSTS.find(({ id }) => id === "08-bn-promo");

    expect(post?.title).toBe("Barnes & Noble promotion");
    expect(post?.headline).toBe("25% off");
    expect(post?.note).toContain("PREORDER25");
    expect(post?.note).toContain("25% off");
    expect(post?.note).toContain("September 9 through 11, 2026");
    expect(post?.note).toContain("Barnes & Noble");
    expect(post?.href).toBe("/buy");
    expectRenditionsOnDisk(post!);
  });

  it("includes the Now Available set without claiming the book is in stores", () => {
    const post = SOCIAL_POSTS.find(({ id }) => id === "09-now-available");

    expect(post?.title).toBe("Now Available");
    expect(post?.headline).toBe("Now available to order");
    expect(post?.note).toMatch(/now available to order/i);
    expect(post?.note).not.toMatch(/in stores/i);
    expect(post?.note).not.toMatch(/pre-order/i);
    expect(post?.href).toBe("/buy");
    expectRenditionsOnDisk(post!);
  });

  it("includes the Goodreads giveaway with an enter link and a soft buy link", () => {
    const post = SOCIAL_POSTS.find(({ id }) => id === "10-goodreads-giveaway");

    expect(post?.title).toBe("Goodreads giveaway");
    expect(post?.headline).toBe("Goodreads Giveaway");
    expect(post?.note).toMatch(/free copies/i);
    expect(post?.note).toMatch(/Goodreads/);
    expect(post?.note).toMatch(/buy/i);
    expect(post?.href).toBe(
      "https://www.goodreads.com/giveaway/enter_choose_address/450157-the-midnight-coder-s-children",
    );
    expect(post?.hrefLabel).toBe("Enter the giveaway");
    expect(post?.secondaryHref).toBe("/buy");
    expect(post?.secondaryLabel).toBe("Buy the book");
    expectRenditionsOnDisk(post!);
  });
});
