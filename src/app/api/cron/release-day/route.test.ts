import { readFileSync } from "node:fs";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type Stripe from "stripe";

import { RELEASE_DATE_ISO } from "@/lib/stripe";

vi.mock("@/lib/stripe", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/stripe")>();
  return {
    ...actual,
    getStripeClient: vi.fn(),
  };
});

vi.mock("@/notifications", () => ({
  notify: vi.fn(),
}));

import { getStripeClient } from "@/lib/stripe";
import { notify } from "@/notifications";
import { GET } from "./route";

const SECRET = "test-cron-secret";
const RELEASE_AT = Date.parse(RELEASE_DATE_ISO);
const DAY_MS = 24 * 60 * 60 * 1000;

function authorizedRequest(path: string): NextRequest {
  return new NextRequest(`https://www.midnightcoderschildren.com${path}`, {
    headers: { authorization: `Bearer ${SECRET}` },
  });
}

function paidSession(
  overrides?: Partial<Stripe.Checkout.Session>,
): Stripe.Checkout.Session {
  return {
    id: "cs_test_preorder",
    object: "checkout.session",
    payment_status: "paid",
    customer_email: "reader@example.com",
    customer_details: {
      email: "reader@example.com",
      name: "Ada Lovelace",
    },
    ...overrides,
  } as Stripe.Checkout.Session;
}

function listSessions(sessions: Stripe.Checkout.Session[]) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const session of sessions) {
        yield session;
      }
    },
  };
}

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", SECRET);
  vi.stubEnv("DOWNLOAD_TOKEN_SECRET", "test-download-secret");
  vi.mocked(getStripeClient).mockReset();
  vi.mocked(notify).mockReset();
  vi.mocked(notify).mockResolvedValue({
    ok: true,
    channel: "email",
    providerMessageId: "re_test",
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("vercel.json crons", () => {
  it("does not schedule any job, including the release-day send", () => {
    const config = JSON.parse(
      readFileSync(path.resolve(__dirname, "../../../../../vercel.json"), "utf8"),
    ) as { crons?: { path: string; schedule: string }[] };

    expect(config.crons ?? []).toEqual([]);
  });
});

describe("GET /api/cron/release-day", () => {
  it("rejects a request without the cron secret", async () => {
    const response = await GET(
      new NextRequest("https://www.midnightcoderschildren.com/api/cron/release-day"),
    );

    expect(response.status).toBe(401);
    expect(getStripeClient).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does nothing before release day", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(RELEASE_AT - 60_000));

    const response = await GET(
      authorizedRequest("/api/cron/release-day?confirm=send"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      skipped: "before release date",
      releaseAt: RELEASE_DATE_ISO,
    });
    expect(getStripeClient).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does nothing after release day, even with confirm=send", async () => {
    // This is the production failure mode: a daily cron after launch, once
    // Resend's 24-hour idempotency window has closed.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-08T13:00:00.000Z"));

    const response = await GET(
      authorizedRequest("/api/cron/release-day?confirm=send"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      skipped: "after release date",
      releaseAt: RELEASE_DATE_ISO,
    });
    expect(getStripeClient).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does nothing on release day unless confirm=send is present", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-15T13:00:00.000Z"));

    const response = await GET(authorizedRequest("/api/cron/release-day"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      skipped: "confirm=send required",
      releaseAt: RELEASE_DATE_ISO,
    });
    expect(getStripeClient).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("sends only on release day when confirm=send is present", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-15T13:00:00.000Z"));

    const list = vi.fn(() => listSessions([paidSession()]));
    vi.mocked(getStripeClient).mockReturnValue({
      checkout: { sessions: { list } },
    } as unknown as Stripe);

    const response = await GET(
      authorizedRequest("/api/cron/release-day?confirm=send"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ sent: 1, skipped: 0, failed: 0 });
    expect(list).toHaveBeenCalledWith({
      limit: 100,
      created: { lt: Math.floor(RELEASE_AT / 1000) },
    });
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "release.available",
        to: "reader@example.com",
      }),
      "cs_test_preorder",
    );
  });

  it("does not treat the day after release as still in the send window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(RELEASE_AT + DAY_MS));

    const response = await GET(
      authorizedRequest("/api/cron/release-day?confirm=send"),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      skipped: "after release date",
    });
    expect(notify).not.toHaveBeenCalled();
  });
});
