import { describe, it, expect, vi, afterEach } from "vitest";
import { buildOpenAiPayload, hashEmail } from "./openai-capi";
import { buildMetaPayload } from "./meta-capi";
import type { AdAttribution } from "./ad-refs";

const ATTRIBUTION: AdAttribution = {
  oppref: "openai-click",
  obref: "openai-browser",
  fbc: "fb.1.1596403881668.AbCdEf",
  fbp: "fb.1.1596403881668.1116446470",
  ipAddress: "203.0.113.7",
  userAgent: "Mozilla/5.0 (Macintosh)",
};

const TIMESTAMP_MS = Date.parse("2026-07-22T12:00:00.000Z");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("OpenAI conversion payload", () => {
  const build = () =>
    buildOpenAiPayload({
      id: "cs_test_123",
      name: "order_created",
      dataType: "contents",
      amount: 1499,
      currency: "USD",
      sourceUrl: "https://midnightcoderschildren.com/buy/success",
      email: " Reader@Example.COM ",
      attribution: ATTRIBUTION,
      timestampMs: TIMESTAMP_MS,
    });

  it("uses the Stripe session id as the event id so the pixel event dedupes", () => {
    expect(build().id).toBe("cs_test_123");
  });

  it("puts oppref at the event level and obref inside user", () => {
    const payload = build();

    expect(payload.oppref).toBe("openai-click");
    expect(payload.user?.obref).toBe("openai-browser");
  });

  it("sends timestamps in milliseconds", () => {
    expect(build().timestamp_ms).toBe(TIMESTAMP_MS);
  });

  it("never transmits the email in clear text", () => {
    const serialized = JSON.stringify(build());

    expect(serialized).not.toContain("Reader@Example.COM");
    expect(serialized).not.toContain("reader@example.com");
    expect(build().user?.email_sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("normalizes case and whitespace before hashing", () => {
    expect(hashEmail("  Reader@Example.COM ")).toBe(hashEmail("reader@example.com"));
  });

  it("does not leak Meta cookies into the OpenAI payload", () => {
    const serialized = JSON.stringify(build());

    expect(serialized).not.toContain("fb.1.1596403881668");
  });

  it("omits the user object entirely when nothing identifies the visitor", () => {
    const payload = buildOpenAiPayload({
      id: "probe",
      name: "checkout_started",
      dataType: "contents",
      sourceUrl: "https://midnightcoderschildren.com/",
    });

    expect(payload.user).toBeUndefined();
    expect(payload.oppref).toBeUndefined();
  });
});

describe("Meta conversion payload", () => {
  const build = () =>
    buildMetaPayload({
      id: "cs_test_123",
      name: "Purchase",
      customData: { value: 14.99, currency: "USD" },
      sourceUrl: "https://midnightcoderschildren.com/buy/success",
      email: " Reader@Example.COM ",
      attribution: ATTRIBUTION,
      timestampMs: TIMESTAMP_MS,
    });

  it("shares the event id with the OpenAI payload and the browser pixel", () => {
    expect(build().event_id).toBe("cs_test_123");
  });

  it("sends event_time in SECONDS, not milliseconds", () => {
    // Meta silently mis-attributes millisecond timestamps as far-future events.
    expect(build().event_time).toBe(Math.floor(TIMESTAMP_MS / 1000));
    expect(String(build().event_time)).toHaveLength(10);
  });

  it("hashes the email into an array, which is Meta's shape", () => {
    const payload = build();

    expect(payload.user_data.em).toEqual([hashEmail("reader@example.com")]);
    expect(JSON.stringify(payload)).not.toContain("Reader@Example.COM");
  });

  it("sends fbc and fbp raw, because hashing them breaks matching", () => {
    const payload = build();

    expect(payload.user_data.fbc).toBe("fb.1.1596403881668.AbCdEf");
    expect(payload.user_data.fbp).toBe("fb.1.1596403881668.1116446470");
  });

  it("does not leak OpenAI references into the Meta payload", () => {
    const serialized = JSON.stringify(build());

    expect(serialized).not.toContain("openai-click");
    expect(serialized).not.toContain("openai-browser");
  });

  it("marks the conversion as a website action", () => {
    expect(build().action_source).toBe("website");
  });

  it("omits custom_data when there is nothing to report", () => {
    const payload = buildMetaPayload({
      id: "probe",
      name: "Lead",
      customData: {},
      sourceUrl: "https://midnightcoderschildren.com/",
    });

    expect(payload.custom_data).toBeUndefined();
  });
});

describe("the two payloads agree", () => {
  it("hashes the same email identically on both platforms", () => {
    const openai = buildOpenAiPayload({
      id: "x",
      name: "order_created",
      dataType: "contents",
      sourceUrl: "https://midnightcoderschildren.com/",
      email: "reader@example.com",
    });
    const meta = buildMetaPayload({
      id: "x",
      name: "Purchase",
      customData: {},
      sourceUrl: "https://midnightcoderschildren.com/",
      email: "reader@example.com",
    });

    expect(meta.user_data.em?.[0]).toBe(openai.user?.email_sha256);
  });
});
