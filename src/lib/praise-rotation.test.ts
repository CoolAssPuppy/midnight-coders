import { describe, expect, it } from "vitest";

import { getNextPraiseIndex } from "./praise-rotation";

describe("rotating praise", () => {
  it("moves through every quote in order", () => {
    expect(getNextPraiseIndex(0, 3)).toBe(1);
    expect(getNextPraiseIndex(1, 3)).toBe(2);
  });

  it("returns to the first quote after the final quote", () => {
    expect(getNextPraiseIndex(2, 3)).toBe(0);
  });

  it("stays on the first quote when no alternatives exist", () => {
    expect(getNextPraiseIndex(0, 1)).toBe(0);
    expect(getNextPraiseIndex(0, 0)).toBe(0);
  });
});
