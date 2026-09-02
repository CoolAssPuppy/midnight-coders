import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getMarketingConsent,
  hasMarketingConsent,
  setMarketingConsent,
} from "./consent";

describe("marketing consent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is denied until the reader grants it", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => null,
        setItem: vi.fn(),
      },
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { cookie: "" });

    expect(getMarketingConsent()).toBeNull();
    expect(hasMarketingConsent()).toBe(false);
  });

  it("records a grant in first-party storage", () => {
    const setItem = vi.fn();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => "granted",
        setItem,
      },
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { cookie: "" });

    expect(hasMarketingConsent()).toBe(true);
    setMarketingConsent("granted");
    expect(setItem).toHaveBeenCalledWith("mcc_marketing_consent", "granted");
  });
});
