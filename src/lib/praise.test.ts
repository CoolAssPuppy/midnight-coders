import { describe, expect, it } from "vitest";

import { PRAISE } from "./praise";

describe("book praise", () => {
  it("includes the Kirkus review", () => {
    expect(PRAISE).toContainEqual({
      quote:
        "As much an intriguing character study as it is a thriller. [A] compelling yarn.",
      source: "Kirkus Reviews",
    });
  });
});
