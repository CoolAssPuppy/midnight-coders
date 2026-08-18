import { describe, expect, it } from "vitest";

import { DEFAULT_CHECKOUT_PREFERENCES } from "./checkout-preferences";

describe("buy page checkout preferences", () => {
  it("keeps author updates implied and does not request beta access", () => {
    expect(DEFAULT_CHECKOUT_PREFERENCES).toEqual({
      newsletterOptIn: true,
      betaReader: false,
    });
  });
});
