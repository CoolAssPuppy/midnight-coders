import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSandboxTransport } from "./engine/testing";
import { notify } from "./index";
import type { Notification } from "./types";

const getPreorder = (overrides?: Partial<Notification>): Notification =>
  ({
    type: "preorder.confirmed",
    to: "reader@example.com",
    data: {
      firstName: "Ada",
      downloadUrl: "https://www.midnightcoderschildren.com/api/download/tok.sig",
      releaseDateIso: "2026-09-15T00:00:00.000Z",
      amount: "$14.99",
      orderReference: "cs_test_123",
      purchasedOn: "July 25, 2026",
    },
    ...overrides,
  }) as Notification;

beforeEach(() => {
  // MAIL_MODE is left unset, so the engine resolves to the sandbox transport
  // and no test can reach the network.
  vi.stubEnv("MAIL_FROM", "Bodhi Press <hello@mail.midnightcoderschildren.com>");
  getSandboxTransport().reset();
});

describe("Notification engine", () => {
  it("sends a notification over the email channel", async () => {
    const result = await notify(getPreorder(), "cs_test_123");

    expect(result).toMatchObject({ ok: true, channel: "email" });
    expect(getSandboxTransport().sentTo("reader@example.com")).toHaveLength(1);
  });

  it("renders both an HTML and a plaintext body", async () => {
    // A missing plaintext alternative reads as a spam signal and breaks
    // clients that refuse HTML outright.
    await notify(getPreorder(), "cs_test_123");

    const [message] = getSandboxTransport().sent;
    expect(message.html).toContain("<");
    expect(message.text.length).toBeGreaterThan(0);
    expect(message.text).not.toContain("<div");
  });

  it("states the release date in the body of a pre-order confirmation", async () => {
    // Design principle 4: a buyer who does not know the book is unreleased
    // writes to support instead.
    await notify(getPreorder(), "cs_test_123");

    const [message] = getSandboxTransport().sent;
    expect(message.text).toContain("September 15, 2026");
  });

  it("does not send twice for one event, however many times it is retried", async () => {
    // Stripe redelivers a webhook whenever the handler fails or times out.
    await notify(getPreorder(), "cs_test_123");
    await notify(getPreorder(), "cs_test_123");
    await notify(getPreorder(), "cs_test_123");

    expect(getSandboxTransport().sent).toHaveLength(1);
  });

  it("still sends a release-day note to someone who already got a confirmation", async () => {
    // Both hang off the same Stripe session, so the key has to include the
    // notification type or the second send would be swallowed as a duplicate.
    await notify(getPreorder(), "cs_test_123");
    await notify(
      {
        type: "release.available",
        to: "reader@example.com",
        data: {
          firstName: "Ada",
          downloadUrl: "https://www.midnightcoderschildren.com/api/download/tok.sig",
          releaseDateIso: "2026-09-15T00:00:00.000Z",
        },
      },
      "cs_test_123",
    );

    expect(getSandboxTransport().sentTo("reader@example.com")).toHaveLength(2);
  });

  it("skips silently when Stripe reported no email address", async () => {
    const result = await notify(getPreorder({ to: "   " }), "cs_test_123");

    expect(result).toEqual({ ok: true, skipped: true, reason: "no_recipient" });
    expect(getSandboxTransport().sent).toHaveLength(0);
  });

  it("reports a transport failure instead of throwing", async () => {
    // The caller is a payment webhook that must return 2xx regardless.
    getSandboxTransport().failOnce("503 Service Unavailable");

    const result = await notify(getPreorder(), "cs_test_123");

    expect(result).toMatchObject({ ok: false, retryable: true });
  });

  it("reports a missing sender instead of throwing", async () => {
    vi.stubEnv("MAIL_FROM", "");

    const result = await notify(getPreorder(), "cs_test_123");

    expect(result).toMatchObject({ ok: false });
  });
});
