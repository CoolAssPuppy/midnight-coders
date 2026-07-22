import { describe, it, expect } from "vitest";
import {
  readRefsFromCookies,
  toStripeMetadata,
  fromStripeMetadata,
  sanitizeRefs,
} from "./ad-refs";

const getCookieJar =
  (jar: Record<string, string>) =>
  (name: string): string | undefined =>
    jar[name];

const ALL_COOKIES = {
  __oppref: "openai-click",
  __obref: "openai-browser",
  _fbc: "fb.1.1596403881668.AbCdEf",
  _fbp: "fb.1.1596403881668.1116446470",
};

describe("reading ad references from the checkout request", () => {
  it("picks up both platforms' cookies in one pass", () => {
    expect(readRefsFromCookies(getCookieJar(ALL_COOKIES))).toEqual({
      oppref: "openai-click",
      obref: "openai-browser",
      fbc: "fb.1.1596403881668.AbCdEf",
      fbp: "fb.1.1596403881668.1116446470",
    });
  });

  it("works when the visitor arrived from only one platform", () => {
    expect(readRefsFromCookies(getCookieJar({ _fbp: "fb.1.2.3" }))).toEqual({
      fbp: "fb.1.2.3",
    });
  });

  it("returns nothing when no pixel has run", () => {
    expect(readRefsFromCookies(getCookieJar({}))).toEqual({});
  });

  it("caps oversized cookie values so they cannot bloat Stripe metadata", () => {
    const refs = readRefsFromCookies(getCookieJar({ __oppref: "a".repeat(5000) }));

    expect(refs.oppref).toHaveLength(500);
  });
});

describe("carrying attribution through Stripe metadata", () => {
  it("survives the round trip to the webhook intact", () => {
    const attribution = {
      ...{
        oppref: "openai-click",
        obref: "openai-browser",
        fbc: "fb.1.1596403881668.AbCdEf",
        fbp: "fb.1.1596403881668.1116446470",
      },
      ipAddress: "203.0.113.7",
      userAgent: "Mozilla/5.0 (Macintosh)",
    };

    expect(fromStripeMetadata(toStripeMetadata(attribution))).toEqual(attribution);
  });

  it("namespaces its keys so product metadata is untouched", () => {
    const metadata: Record<string, string> = {
      productType: "digital-edition",
      ...toStripeMetadata({ fbc: "fb.1.2.3" }),
    };

    expect(metadata.productType).toBe("digital-edition");
    expect(metadata.ad_fbc).toBe("fb.1.2.3");
  });

  it("omits absent values rather than writing empty strings", () => {
    expect(toStripeMetadata({ obref: "xyz" })).toEqual({ ad_obref: "xyz" });
  });

  it("truncates to the 500 character Stripe metadata limit", () => {
    expect(toStripeMetadata({ userAgent: "u".repeat(900) }).ad_ua).toHaveLength(500);
  });

  it("returns nothing for a session that predates this tracking", () => {
    expect(fromStripeMetadata(null)).toEqual({});
    expect(fromStripeMetadata({ productType: "digital-edition" })).toEqual({});
  });

  it("stays within Stripe's 50 key metadata limit", () => {
    const keys = Object.keys(
      toStripeMetadata({
        oppref: "a",
        obref: "b",
        fbc: "c",
        fbp: "d",
        ipAddress: "e",
        userAgent: "f",
      }),
    );

    expect(keys).toHaveLength(6);
  });
});

describe("sanitizing untrusted references", () => {
  it("drops non-string and unexpected fields", () => {
    expect(
      sanitizeRefs({ oppref: 42, fbc: { evil: true }, extra: "no" }),
    ).toEqual({});
  });

  it("tolerates a missing or malformed value", () => {
    expect(sanitizeRefs(undefined)).toEqual({});
    expect(sanitizeRefs(null)).toEqual({});
    expect(sanitizeRefs("nope")).toEqual({});
  });
});
