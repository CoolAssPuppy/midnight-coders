import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildFbc,
  mergeCampaignParams,
  readCampaignParamsFromSearch,
  sanitizeCampaignParams,
} from "./campaign-params";

describe("campaign params", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads fbclid, gclid, and UTMs from a landing query string", () => {
    expect(
      readCampaignParamsFromSearch(
        "?fbclid=abc&gclid=123&utm_source=meta&utm_medium=paid&utm_campaign=launch&other=drop",
      ),
    ).toEqual({
      fbclid: "abc",
      gclid: "123",
      utm_source: "meta",
      utm_medium: "paid",
      utm_campaign: "launch",
    });
  });

  it("drops empty and oversized junk rather than storing it", () => {
    expect(sanitizeCampaignParams({ fbclid: "  ", utm_source: 12 })).toEqual({});
    expect(sanitizeCampaignParams({ fbclid: "x".repeat(600) }).fbclid).toHaveLength(
      500,
    );
  });

  it("lets a later click overwrite an earlier one of the same key", () => {
    expect(
      mergeCampaignParams(
        { utm_source: "newsletter", fbclid: "old" },
        { fbclid: "new" },
      ),
    ).toEqual({ utm_source: "newsletter", fbclid: "new" });
  });

  it("builds Meta's _fbc value from fbclid", () => {
    expect(buildFbc("AbCdEf", 1596403881668)).toBe("fb.1.1596403881668.AbCdEf");
  });
});
