import { describe, expect, it } from "vitest";

import { MemoryTransport } from "./memory";
import type { OutgoingMessage } from "./types";

const getMessage = (
  overrides?: Partial<OutgoingMessage>,
): OutgoingMessage => ({
  to: "reader@example.com",
  from: "Bodhi Press <hello@mail.midnightcoderschildren.com>",
  subject: "Your pre-order is confirmed",
  html: "<p>Thank you</p>",
  text: "Thank you",
  idempotencyKey: "cs_test_123:preorder-confirmation",
  ...overrides,
});

describe("Transport idempotency", () => {
  it("sends a message once", async () => {
    const transport = new MemoryTransport();

    const result = await transport.send(getMessage());

    expect(result.ok).toBe(true);
    expect(transport.sent).toHaveLength(1);
  });

  it("does not send twice when the same idempotency key is reused", async () => {
    // Stripe redelivers a webhook whenever the handler fails or times out. A
    // buyer must never receive two copies of their receipt.
    const transport = new MemoryTransport();

    const first = await transport.send(getMessage());
    const second = await transport.send(getMessage());

    expect(transport.sent).toHaveLength(1);
    expect(second).toEqual(first);
  });

  it("treats different templates to the same buyer as separate sends", async () => {
    const transport = new MemoryTransport();

    await transport.send(
      getMessage({ idempotencyKey: "cs_test_123:preorder-confirmation" }),
    );
    await transport.send(
      getMessage({ idempotencyKey: "cs_test_123:release-day-delivery" }),
    );

    expect(transport.sentTo("reader@example.com")).toHaveLength(2);
  });

  it("allows a retry under the same key after a failure", async () => {
    // A transient provider outage must not permanently swallow a receipt.
    const transport = new MemoryTransport();
    transport.failOnce("503 Service Unavailable");

    const failed = await transport.send(getMessage());
    const retried = await transport.send(getMessage());

    expect(failed.ok).toBe(false);
    expect(retried.ok).toBe(true);
    expect(transport.sent).toHaveLength(1);
  });

  it("reports whether a failure is worth retrying", async () => {
    const transport = new MemoryTransport();
    transport.failOnce("422 Invalid recipient", false);

    const result = await transport.send(getMessage());

    expect(result).toEqual({
      ok: false,
      error: "422 Invalid recipient",
      retryable: false,
    });
  });
});
