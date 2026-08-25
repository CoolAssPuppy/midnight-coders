import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { SOCIAL_POSTS } from "./social-posts.generated";

describe("social post assets", () => {
  it("includes downloadable Kirkus cards in every size and format", () => {
    const post = SOCIAL_POSTS.find(({ id }) => id === "07-praise-kirkus");

    expect(post?.headline).toBe(
      "As much an intriguing character study as it is a thriller. [A] compelling yarn.",
    );
    expect(post?.renditions).toHaveLength(3);

    for (const rendition of post?.renditions ?? []) {
      for (const file of [rendition.png, rendition.jpg, rendition.mp4]) {
        const relativeFile = file.split("?")[0];
        expect(existsSync(path.join(process.cwd(), "public", relativeFile))).toBe(
          true,
        );
      }
    }
  });
});
