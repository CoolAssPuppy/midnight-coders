import { describe, expect, it } from "vitest";
import { AMAZON_PAPERBACK_URL } from "@/lib/buy-links";
import { withAmazonCampaignParams } from "./amazon-url";

describe("Amazon campaign params", () => {
  it("appends UTMs without changing the ASIN path", () => {
    const href = withAmazonCampaignParams(AMAZON_PAPERBACK_URL, {
      utm_source: "meta",
      utm_medium: "paid",
      fbclid: "abc",
    });
    const url = new URL(href);

    expect(url.pathname).toBe("/dp/B0H9BLKH9M");
    expect(url.searchParams.get("utm_source")).toBe("meta");
    expect(url.searchParams.get("utm_medium")).toBe("paid");
    expect(url.searchParams.get("fbclid")).toBe("abc");
  });

  it("does not overwrite an Amazon tag already on the URL", () => {
    const tagged =
      "https://www.amazon.com/dp/B0HBGYKMH3?tag=maas&ref_=aa_maas";
    const href = withAmazonCampaignParams(tagged, { tag: "other", utm_source: "x" });
    const url = new URL(href);

    expect(url.searchParams.get("tag")).toBe("maas");
    expect(url.searchParams.get("utm_source")).toBe("x");
  });

  it("leaves non-Amazon URLs untouched", () => {
    const bn =
      "https://www.barnesandnoble.com/w/the-midnight-coders-children-prashant-sridharan/1150827730";
    expect(withAmazonCampaignParams(bn, { utm_source: "meta" })).toBe(bn);
  });
});
