import { describe, expect, it } from "vitest";
import {
  consentRegionFromCountry,
  parseConsentRegion,
} from "./consent-region";

describe("consent region", () => {
  it("requires a prompt in the EEA, the UK, and Switzerland", () => {
    expect(consentRegionFromCountry("PT")).toBe("strict");
    expect(consentRegionFromCountry("DE")).toBe("strict");
    expect(consentRegionFromCountry("gb")).toBe("strict");
    expect(consentRegionFromCountry("CH")).toBe("strict");
  });

  it("leaves the prompt off for typical paid-traffic countries", () => {
    expect(consentRegionFromCountry("US")).toBe("open");
    expect(consentRegionFromCountry("CA")).toBe("open");
    expect(consentRegionFromCountry("AU")).toBe("open");
    expect(consentRegionFromCountry("IN")).toBe("open");
  });

  it("fails closed when the country is missing or unknown", () => {
    expect(consentRegionFromCountry(null)).toBe("strict");
    expect(consentRegionFromCountry("")).toBe("strict");
    expect(consentRegionFromCountry("XX")).toBe("strict");
    expect(consentRegionFromCountry("T1")).toBe("strict");
  });

  it("reads only the two cookie values the proxy writes", () => {
    expect(parseConsentRegion("open")).toBe("open");
    expect(parseConsentRegion("strict")).toBe("strict");
    expect(parseConsentRegion("granted")).toBeNull();
    expect(parseConsentRegion(null)).toBeNull();
  });
});
