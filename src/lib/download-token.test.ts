import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createDownloadToken, verifyDownloadToken } from "./download-token";

const RELEASE = Date.parse("2026-09-15T00:00:00.000Z");
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

const getToken = (overrides?: Partial<Parameters<typeof createDownloadToken>[0]>) =>
  createDownloadToken({
    sessionId: "cs_test_123",
    notBefore: RELEASE,
    expiresAt: RELEASE + YEAR_MS,
    ...overrides,
  });

beforeEach(() => {
  vi.stubEnv("DOWNLOAD_TOKEN_SECRET", "test-secret-do-not-use-in-production");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("download tokens", () => {
  it("accepts a genuine token once the book is released", () => {
    const result = verifyDownloadToken(getToken(), RELEASE + 1000);

    expect(result.valid).toBe(true);
    expect(result.valid && result.payload.sessionId).toBe("cs_test_123");
  });

  it("refuses to serve the file before release day", () => {
    const dayBefore = RELEASE - 24 * 60 * 60 * 1000;
    const result = verifyDownloadToken(getToken(), dayBefore);

    expect(result.valid).toBe(false);
    expect(result.valid === false && result.reason).toBe("not_yet_valid");
  });

  it("still exposes the release date when early, so the buyer can be told when", () => {
    const result = verifyDownloadToken(getToken(), RELEASE - 1000);

    expect(result.valid === false && result.payload?.notBefore).toBe(RELEASE);
  });

  it("rejects a token after its window closes", () => {
    const result = verifyDownloadToken(getToken(), RELEASE + YEAR_MS + 1000);

    expect(result.valid).toBe(false);
    expect(result.valid === false && result.reason).toBe("expired");
  });

  it("accepts a token on the last day of its window", () => {
    expect(verifyDownloadToken(getToken(), RELEASE + YEAR_MS - 1000).valid).toBe(true);
  });

  it("rejects a tampered payload", () => {
    const token = getToken();
    const [payload, signature] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({
        sessionId: "cs_attacker",
        notBefore: 0,
        expiresAt: Date.now() + YEAR_MS,
      }),
      "utf8",
    ).toString("base64url");

    expect(payload).not.toBe(forged);
    const result = verifyDownloadToken(`${forged}.${signature}`, RELEASE + 1000);

    expect(result.valid).toBe(false);
    expect(result.valid === false && result.reason).toBe("bad_signature");
  });

  it("rejects a token signed with a different secret", () => {
    const token = getToken();
    vi.stubEnv("DOWNLOAD_TOKEN_SECRET", "a-completely-different-secret");

    const result = verifyDownloadToken(token, RELEASE + 1000);

    expect(result.valid).toBe(false);
    expect(result.valid === false && result.reason).toBe("bad_signature");
  });

  it("rejects malformed input rather than throwing", () => {
    const now = RELEASE + 1000;

    expect(() => verifyDownloadToken("", now)).not.toThrow();
    expect(verifyDownloadToken("", now).valid).toBe(false);
    expect(verifyDownloadToken("no-separator", now).valid).toBe(false);
    expect(verifyDownloadToken(".onlysignature", now).valid).toBe(false);
    expect(verifyDownloadToken("a.b.c", now).valid).toBe(false);
  });

  it("does not leak a usable token when the payload is not valid JSON", () => {
    const junk = Buffer.from("not json", "utf8").toString("base64url");
    // Sign the junk correctly, so only the payload shape is wrong.
    const token = createDownloadToken({
      sessionId: "x",
      notBefore: 0,
      expiresAt: 1,
    });
    const signature = token.split(".")[1];

    expect(verifyDownloadToken(`${junk}.${signature}`, RELEASE).valid).toBe(false);
  });

  it("produces a distinct token per purchase", () => {
    expect(getToken({ sessionId: "cs_a" })).not.toBe(getToken({ sessionId: "cs_b" }));
  });

  it("throws if the signing secret is missing, rather than signing with nothing", () => {
    vi.stubEnv("DOWNLOAD_TOKEN_SECRET", "");

    expect(() => getToken()).toThrow(/DOWNLOAD_TOKEN_SECRET/);
  });
});
