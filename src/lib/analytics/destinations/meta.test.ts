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
  const sendBeacon = vi.fn((url: string) => url.length > 0);

  /** Event names that left the browser through the pixel script. */
  const fbqEventNames = (): string[] =>
    fbq.mock.calls.map((call) => String(call[1]));

  /** Event names that left the browser through the beacon endpoint. */
  const beaconEventNames = (): string[] =>
    sendBeacon.mock.calls.map(
      (call) => new URL(String(call[0])).searchParams.get("ev") ?? "",
    );

  /**
   * Every request Meta will actually count, across both transports.
   *
   * Assert on this, not on the mapping. The mapping was right on 16 August 2026
   * and the pixel still double counted, because each event went out twice.
   */
  const countedEventNames = (): string[] => [
    ...fbqEventNames(),
    ...beaconEventNames(),
  ];

  /** A loaded pixel: fbevents.js installs callMethod, the inline stub does not. */
  const loadedFbq = () => Object.assign(fbq, { callMethod: () => {} });

  beforeEach(() => {
    fbq.mockReset();
    sendBeacon.mockReset();
    sendBeacon.mockImplementation((url: string) => url.length > 0);
    vi.stubGlobal("window", { fbq: loadedFbq() });
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubEnv("NEXT_PUBLIC_META_DATASET_ID", "123456789");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("counts a retailer click once, not once per transport", () => {
    metaDestination.send("book_retailer_click", { retailer: "amazon" });

    expect(countedEventNames()).toEqual(["RetailerClick", "PreorderIntent"]);
    expect(beaconEventNames()).toEqual([]);
  });

  it("counts a Stripe checkout start once, not once per transport", () => {
    metaDestination.send("begin_checkout", {
      ecommerce: {
        currency: "USD",
        value: 14.99,
        items: [{ item_id: "midnight-coders-digital", quantity: 1, price: 14.99 }],
      },
    });

    expect(countedEventNames()).toEqual(["InitiateCheckout", "PreorderIntent"]);
    expect(beaconEventNames()).toEqual([]);
  });

  it("sends PreorderIntent exactly once on each buy path so the two are comparable", () => {
    metaDestination.send("book_retailer_click", { retailer: "amazon" });
    const fromRetailer = countedEventNames().filter(
      (name) => name === "PreorderIntent",
    );

    fbq.mockReset();
    sendBeacon.mockReset();
    sendBeacon.mockImplementation((url: string) => url.length > 0);

    metaDestination.send("begin_checkout", {
      ecommerce: {
        currency: "USD",
        value: 14.99,
        items: [{ item_id: "midnight-coders-digital", quantity: 1, price: 14.99 }],
      },
    });
    const fromStripe = countedEventNames().filter(
      (name) => name === "PreorderIntent",
    );

    expect(fromRetailer).toHaveLength(1);
    expect(fromStripe).toHaveLength(1);
  });

  it("attaches the buy path and the event id to what it sends", () => {
    metaDestination.send("book_retailer_click", { retailer: "amazon" });

    const [method, , retailerData, retailerOptions] = fbq.mock.calls[0] ?? [];
    expect(method).toBe("trackCustom");
    expect(retailerData).toEqual({ retailer: "amazon" });
    expect(retailerOptions).toEqual({ eventID: expect.any(String) });

    expect(fbq.mock.calls[1]?.[2]).toEqual({
      channel: "amazon",
      retailer: "amazon",
    });
  });

  it("falls back to the beacon when there is no fbq at all", () => {
    vi.stubGlobal("window", {});

    metaDestination.send("book_retailer_click", { retailer: "amazon" });

    expect(fbqEventNames()).toEqual([]);
    expect(countedEventNames()).toEqual(["RetailerClick", "PreorderIntent"]);
  });

  it("beacons rather than queueing into a stub when fbevents.js never loaded", () => {
    // The inline snippet defines fbq synchronously and pushes onto fbq.queue
    // until the script arrives. On 20 August 2026 connect.facebook.net answered
    // 503 in a real browser: fbq was a function, the queue never flushed, and a
    // readiness check on `typeof fbq` alone would have dropped the event.
    const stub = vi.fn();
    vi.stubGlobal("window", { fbq: stub });

    metaDestination.send("book_retailer_click", { retailer: "amazon" });

    expect(stub).not.toHaveBeenCalled();
    expect(beaconEventNames()).toEqual(["RetailerClick", "PreorderIntent"]);
  });

  it("keeps a fan-out on one transport so the two events stay comparable", () => {
    const stub = vi.fn();
    vi.stubGlobal("window", { fbq: stub });

    metaDestination.send("book_retailer_click", { retailer: "amazon" });

    // Never one event via fbq and its twin via the beacon.
    expect(fbqEventNames()).toEqual([]);
    expect(beaconEventNames()).toHaveLength(2);
  });

  it("falls back to the beacon when fbq throws, without counting the failed call", () => {
    fbq.mockImplementation(() => {
      throw new Error("pixel blocked");
    });

    metaDestination.send("book_retailer_click", { retailer: "amazon" });

    expect(beaconEventNames()).toEqual(["RetailerClick", "PreorderIntent"]);
  });

  it("does not send a standard checkout event for a retailer click", () => {
    metaDestination.send("book_retailer_click", {
      retailer: "barnes_and_noble",
    });

    const names = countedEventNames();
    expect(names).toEqual(["RetailerClick", "PreorderIntent"]);
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
    expect(countedEventNames()).toEqual([]);
  });
});
