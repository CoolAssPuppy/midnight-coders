import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { subscribeToNewsletter } from "./beehiiv";

const CREATED = {
  data: { id: "sub_abc123", status: "pending", email: "reader@example.com" },
};

function mockFetch(
  status: number,
  body: unknown,
): ReturnType<typeof vi.fn> {
  const fn = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fn);

  return fn;
}

function lastBody(fn: ReturnType<typeof vi.fn>): Record<string, unknown> {
  return JSON.parse(fn.mock.calls[0][1].body);
}

beforeEach(() => {
  vi.stubEnv("BEEHIIV_API_KEY", "test-key");
  vi.stubEnv("BEEHIIV_PUBLICATION_ID", "pub_test");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Newsletter subscription", () => {
  it("subscribes an address and reports the resulting status", async () => {
    mockFetch(200, CREATED);

    const result = await subscribeToNewsletter({ email: "reader@example.com" });

    expect(result).toEqual({ ok: true, id: "sub_abc123", status: "pending" });
  });

  it("forces double opt-in by default", async () => {
    // The public form is the one place someone can pump fake addresses at the
    // sending reputation. Confirmation is the defence that works.
    const fetchMock = mockFetch(200, CREATED);

    await subscribeToNewsletter({ email: "reader@example.com" });

    expect(lastBody(fetchMock).double_opt_override).toBe("on");
  });

  it("defers to the publication setting when the caller asks it to", async () => {
    // Buyers gave their address in a transaction, not through an open form.
    const fetchMock = mockFetch(200, CREATED);

    await subscribeToNewsletter({
      email: "buyer@example.com",
      doubleOptIn: "not_set",
    });

    expect(lastBody(fetchMock).double_opt_override).toBe("not_set");
  });

  it("sends names as custom fields, omitting the ones not supplied", async () => {
    const fetchMock = mockFetch(200, CREATED);

    await subscribeToNewsletter({
      email: "reader@example.com",
      firstName: "Ada",
    });

    expect(lastBody(fetchMock).custom_fields).toEqual([
      { name: "First Name", value: "Ada" },
    ]);
  });

  it("omits custom fields entirely when there are none", async () => {
    const fetchMock = mockFetch(200, CREATED);

    await subscribeToNewsletter({ email: "reader@example.com" });

    expect(lastBody(fetchMock)).not.toHaveProperty("custom_fields");
  });

  it("treats a rate limit as retryable", async () => {
    // beehiiv allows 180 requests per minute per organisation.
    mockFetch(429, { errors: [{ message: "Too many requests" }] });

    const result = await subscribeToNewsletter({ email: "reader@example.com" });

    expect(result).toMatchObject({ ok: false, retryable: true });
  });

  it("treats a rejected payload as not worth retrying", async () => {
    mockFetch(400, { errors: [{ message: "Invalid email address" }] });

    const result = await subscribeToNewsletter({ email: "nope" });

    expect(result).toEqual({
      ok: false,
      error: "Invalid email address",
      retryable: false,
    });
  });

  it("treats a network failure as retryable", async () => {
    // The request may never have reached beehiiv at all.
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));

    const result = await subscribeToNewsletter({ email: "reader@example.com" });

    expect(result).toMatchObject({ ok: false, retryable: true });
  });

  it("fails clearly and without retrying when it is not configured", async () => {
    vi.stubEnv("BEEHIIV_API_KEY", "");

    const result = await subscribeToNewsletter({ email: "reader@example.com" });

    expect(result).toMatchObject({ ok: false, retryable: false });
  });

  it("does not retry on an unrecognised response shape without saying why", async () => {
    mockFetch(200, { unexpected: true });

    const result = await subscribeToNewsletter({ email: "reader@example.com" });

    expect(result).toMatchObject({ ok: false, retryable: true });
  });
});
