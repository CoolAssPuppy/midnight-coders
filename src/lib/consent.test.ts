import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getMarketingConsent,
  hasMarketingConsent,
  isStrictConsentRegion,
  setMarketingConsent,
} from "./consent";

describe("marketing consent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is denied in a strict region until the reader grants it", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => null,
        setItem: vi.fn(),
      },
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { cookie: "mcc_consent_region=strict" });

    expect(getMarketingConsent()).toBeNull();
    expect(isStrictConsentRegion()).toBe(true);
    expect(hasMarketingConsent()).toBe(false);
  });

  it("is denied when the region cookie is missing", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => null,
        setItem: vi.fn(),
      },
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { cookie: "" });

    expect(hasMarketingConsent()).toBe(false);
    expect(isStrictConsentRegion()).toBe(true);
  });

  it("allows measurement in an open region with no stored choice", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => null,
        setItem: vi.fn(),
      },
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { cookie: "mcc_consent_region=open" });

    expect(getMarketingConsent()).toBeNull();
    expect(isStrictConsentRegion()).toBe(false);
    expect(hasMarketingConsent()).toBe(true);
  });

  it("still honours an explicit denial in an open region", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => "denied",
        setItem: vi.fn(),
      },
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { cookie: "mcc_consent_region=open" });

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
