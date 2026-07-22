import { describe, it, expect, afterEach, vi } from "vitest";
import { readR2Config, buildObjectUrl, presignEbookUrl, type R2Config } from "./r2";

const getConfig = (overrides?: Partial<R2Config>): R2Config => ({
  accountId: "abc123account",
  accessKeyId: "AKIAEXAMPLE",
  secretAccessKey: "secretexamplekey",
  bucket: "bodhi-press-books",
  objectKey: "the-midnight-coders-children.epub",
  ...overrides,
});

const setAllEnv = (): void => {
  vi.stubEnv("R2_ACCOUNT_ID", "abc123account");
  vi.stubEnv("R2_ACCESS_KEY_ID", "AKIAEXAMPLE");
  vi.stubEnv("R2_SECRET_ACCESS_KEY", "secretexamplekey");
  vi.stubEnv("R2_BUCKET", "bodhi-press-books");
  vi.stubEnv("R2_EPUB_KEY", "the-midnight-coders-children.epub");
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("R2 configuration", () => {
  it("reads a complete configuration from the environment", () => {
    setAllEnv();
    const result = readR2Config();

    expect(result.ok).toBe(true);
    expect(result.ok && result.config.bucket).toBe("bodhi-press-books");
  });

  it("names exactly which variables are missing, not just that it failed", () => {
    setAllEnv();
    vi.stubEnv("R2_SECRET_ACCESS_KEY", "");
    vi.stubEnv("R2_BUCKET", "");

    const result = readR2Config();

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.missing).toEqual([
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET",
    ]);
  });

  it("reports every variable when nothing is configured", () => {
    for (const key of [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET",
      "R2_EPUB_KEY",
    ]) {
      vi.stubEnv(key, "");
    }

    const result = readR2Config();
    expect(result.ok === false && result.missing).toHaveLength(5);
  });
});

describe("R2 object URL", () => {
  it("uses the account endpoint with path-style addressing", () => {
    expect(buildObjectUrl(getConfig())).toBe(
      "https://abc123account.r2.cloudflarestorage.com/bodhi-press-books/the-midnight-coders-children.epub",
    );
  });

  it("encodes spaces and special characters in the key", () => {
    const url = buildObjectUrl(getConfig({ objectKey: "books/my book (v2).epub" }));

    expect(url).toContain("books/my%20book%20(v2).epub");
  });

  it("keeps path separators as separators rather than encoding them", () => {
    const url = buildObjectUrl(getConfig({ objectKey: "2026/09/book.epub" }));

    expect(url).toContain("/2026/09/book.epub");
    expect(url).not.toContain("%2F");
  });
});

describe("presigned URLs", () => {
  it("signs the request into the query string so no headers are needed", async () => {
    const url = new URL(await presignEbookUrl(getConfig(), 900));

    expect(url.searchParams.get("X-Amz-Signature")).toBeTruthy();
    expect(url.searchParams.get("X-Amz-Credential")).toContain("AKIAEXAMPLE");
    expect(url.searchParams.get("X-Amz-Expires")).toBe("900");
  });

  it("never puts the secret key in the URL", async () => {
    const url = await presignEbookUrl(getConfig(), 900);

    expect(url).not.toContain("secretexamplekey");
  });

  it("honours a custom expiry", async () => {
    const url = new URL(await presignEbookUrl(getConfig(), 60));

    expect(url.searchParams.get("X-Amz-Expires")).toBe("60");
  });

  it("points at the configured object", async () => {
    const url = await presignEbookUrl(getConfig(), 900);

    expect(url).toContain("bodhi-press-books/the-midnight-coders-children.epub");
  });

  it("produces a different signature for a different object", async () => {
    const a = new URL(await presignEbookUrl(getConfig(), 900));
    const b = new URL(await presignEbookUrl(getConfig({ objectKey: "other.epub" }), 900));

    expect(a.searchParams.get("X-Amz-Signature")).not.toBe(
      b.searchParams.get("X-Amz-Signature"),
    );
  });
});
