import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildMetaBeaconUrl, metaDestination } from "./meta";
import type { MetaEvent } from "../meta-events";

const RETAILER_CLICK: MetaEvent = {
  name: "RetailerClick",
  method: "trackCustom",
  customData: { retailer: "amazon" },
  eventId: "evt-retailer-1",
};

describe("Meta beacon URL", () => {
  it("puts the event name, event id, and custom data on the pixel endpoint", () => {
    const url = new URL(buildMetaBeaconUrl("123456789", RETAILER_CLICK));

    expect(url.origin + url.pathname).toBe("https://www.facebook.com/tr/");
    expect(url.searchParams.get("id")).toBe("123456789");
    expect(url.searchParams.get("ev")).toBe("RetailerClick");
    expect(url.searchParams.get("eid")).toBe("evt-retailer-1");
    expect(url.searchParams.get("cd[retailer]")).toBe("amazon");
    expect(url.searchParams.get("noscript")).toBe("1");
  });

  it("serializes structured custom data rather than dropping it", () => {
    const url = new URL(
      buildMetaBeaconUrl("123456789", {
        name: "Purchase",
        method: "track",
        customData: {
          value: 14.99,
          currency: "USD",
          content_ids: ["midnight-coders-digital"],
        },
        eventId: "cs_test_123",
      }),
    );

    expect(url.searchParams.get("cd[value]")).toBe("14.99");
    expect(url.searchParams.get("cd[currency]")).toBe("USD");
    expect(url.searchParams.get("cd[content_ids]")).toBe(
      '["midnight-coders-digital"]',
    );
  });
});

describe("Meta browser destination", () => {
  const fbq = vi.fn();
  const sendBeacon = vi.fn(() => true);

  beforeEach(() => {
    fbq.mockReset();
    sendBeacon.mockReset();
    sendBeacon.mockReturnValue(true);
    vi.stubGlobal("window", { fbq });
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubEnv("NEXT_PUBLIC_META_DATASET_ID", "123456789");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("sends InitiateCheckout for the Stripe buy button, with an event id", () => {
    metaDestination.send("begin_checkout", {
      ecommerce: {
        currency: "USD",
        value: 14.99,
        items: [{ item_id: "midnight-coders-digital", quantity: 1, price: 14.99 }],
      },
    });

    expect(fbq).toHaveBeenCalledTimes(1);
    const [method, name, data, options] = fbq.mock.calls[0] ?? [];
    expect(method).toBe("track");
    expect(name).toBe("InitiateCheckout");
    expect(data).toEqual(
      expect.objectContaining({ value: 14.99, currency: "USD" }),
    );
    expect(options).toEqual({ eventID: expect.any(String) });
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("sends RetailerClick as a custom event and beacons it before navigation", () => {
    metaDestination.send("book_retailer_click", { retailer: "amazon" });

    expect(fbq).toHaveBeenCalledTimes(1);
    const [method, name, data, options] = fbq.mock.calls[0] ?? [];
    expect(method).toBe("trackCustom");
    expect(name).toBe("RetailerClick");
    expect(data).toEqual({ retailer: "amazon" });
    expect(options).toEqual({ eventID: expect.any(String) });

    const eventId = (options as { eventID: string }).eventID;
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon).toHaveBeenCalledWith(
      expect.stringContaining("ev=RetailerClick"),
    );
    expect(sendBeacon).toHaveBeenCalledWith(
      expect.stringContaining("cd%5Bretailer%5D=amazon"),
    );
    expect(sendBeacon).toHaveBeenCalledWith(expect.stringContaining(`eid=${eventId}`));
  });

  it("does not send a standard checkout event for a retailer click", () => {
    metaDestination.send("book_retailer_click", {
      retailer: "barnes_and_noble",
    });

    const names = fbq.mock.calls.map((call) => call[1]);
    expect(names).toEqual(["RetailerClick"]);
    expect(names).not.toContain("InitiateCheckout");
    expect(names).not.toContain("AddToCart");
    expect(names).not.toContain("Purchase");
  });

  it("sends Purchase with value, currency, and the Stripe session as event id", () => {
    metaDestination.send("purchase", {
      ecommerce: {
        currency: "USD",
        value: 14.99,
        transaction_id: "cs_test_123",
        items: [{ item_id: "midnight-coders-digital", quantity: 1, price: 14.99 }],
      },
    });

    const [method, name, data, options] = fbq.mock.calls[0] ?? [];
    expect(method).toBe("track");
    expect(name).toBe("Purchase");
    expect(data).toEqual(
      expect.objectContaining({ value: 14.99, currency: "USD" }),
    );
    expect(options).toEqual({ eventID: "cs_test_123" });
  });

  it("ignores events this destination does not own", () => {
    metaDestination.send("excerpt_progress", { percent: 50 });
    expect(fbq).not.toHaveBeenCalled();
    expect(sendBeacon).not.toHaveBeenCalled();
  });
});
