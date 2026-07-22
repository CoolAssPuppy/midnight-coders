import { describe, it, expect } from "vitest";
import { toOpenAiEvent, toMinorUnits } from "./openai-events";
import { toMetaEvent } from "./meta-events";
import { PRODUCTS } from "./products";

const getPurchaseProperties = (): Record<string, unknown> => ({
  ecommerce: {
    currency: "USD",
    value: 14.99,
    transaction_id: "cs_test_123",
    items: [{ ...PRODUCTS.digitalEdition, quantity: 1 }],
  },
});

describe("OpenAI Ads event mapping", () => {
  it("reports a completed purchase as order_created in minor units", () => {
    const result = toOpenAiEvent("purchase", getPurchaseProperties());

    expect(result?.name).toBe("order_created");
    expect(result?.data.type).toBe("contents");
    expect(result?.data.amount).toBe(1499);
    expect(result?.eventId).toBe("cs_test_123");
  });

  it("maps contents using OpenAI field names, since unknown fields are rejected", () => {
    const result = toOpenAiEvent("purchase", getPurchaseProperties());

    expect(result?.data.contents).toEqual([
      {
        id: "midnight-coders-digital",
        name: "The Midnight Coder's Children (Digital Edition)",
        content_type: "Ebook",
        quantity: 1,
        amount: 1499,
        currency: "USD",
      },
    ]);
  });

  it("keeps the offsite retailer funnel separate from the onsite one", () => {
    expect(toOpenAiEvent("book_retailer_click", {})?.name).toBe("checkout_started");
    expect(toOpenAiEvent("begin_checkout", getPurchaseProperties())?.name).toBe(
      "items_added",
    );
  });

  it("omits amount on a retailer click, because the sale happens offsite", () => {
    const result = toOpenAiEvent("book_retailer_click", { retailer: "amazon" });

    expect(result?.data.amount).toBeUndefined();
  });

  it("omits contents on customer_action events, which do not accept them", () => {
    const result = toOpenAiEvent("newsletter_signup", getPurchaseProperties());

    expect(result?.data.type).toBe("customer_action");
    expect(result?.data.contents).toBeUndefined();
  });

  it("drops events that are not conversions", () => {
    expect(toOpenAiEvent("some_future_event", {})).toBeNull();
  });

  it("skips malformed items rather than emitting empty objects", () => {
    const result = toOpenAiEvent("purchase", {
      ecommerce: { items: [null, "nope", {}, { item_id: "real" }] },
    });

    expect(result?.data.contents).toEqual([{ id: "real" }]);
  });

  it("tolerates a malformed ecommerce payload", () => {
    expect(() => toOpenAiEvent("purchase", { ecommerce: null })).not.toThrow();
    expect(toOpenAiEvent("purchase", { ecommerce: { value: "14.99" } })?.data.amount)
      .toBeUndefined();
  });
});

describe("Meta event mapping", () => {
  it("reports a completed purchase as Purchase in major units", () => {
    const result = toMetaEvent("purchase", getPurchaseProperties());

    expect(result?.name).toBe("Purchase");
    // Meta takes dollars where OpenAI takes cents. Mixing these up would
    // misreport revenue by 100x.
    expect(result?.customData.value).toBe(14.99);
    expect(result?.customData.currency).toBe("USD");
    expect(result?.eventId).toBe("cs_test_123");
  });

  it("mirrors the OpenAI funnel split with Meta's own event names", () => {
    expect(toMetaEvent("book_retailer_click", {})?.name).toBe("InitiateCheckout");
    expect(toMetaEvent("begin_checkout", getPurchaseProperties())?.name).toBe(
      "AddToCart",
    );
    expect(toMetaEvent("newsletter_signup", {})?.name).toBe("Lead");
  });

  it("emits content_ids alongside contents, which Meta uses for catalog matching", () => {
    const result = toMetaEvent("purchase", getPurchaseProperties());

    expect(result?.customData.content_ids).toEqual(["midnight-coders-digital"]);
    expect(result?.customData.contents).toEqual([
      { id: "midnight-coders-digital", quantity: 1, item_price: 14.99 },
    ]);
    expect(result?.customData.content_type).toBe("product");
  });

  it("drops items with no id, which Meta cannot match", () => {
    const result = toMetaEvent("purchase", {
      ecommerce: { items: [{ item_name: "no id here" }] },
    });

    expect(result?.customData.contents).toBeUndefined();
  });

  it("drops events that are not conversions", () => {
    expect(toMetaEvent("some_future_event", {})).toBeNull();
  });
});

describe("both platforms agree on the same purchase", () => {
  it("shares one event id so neither double counts against the other", () => {
    const properties = getPurchaseProperties();

    expect(toOpenAiEvent("purchase", properties)?.eventId).toBe(
      toMetaEvent("purchase", properties)?.eventId,
    );
  });

  it("expresses the same amount in each platform's own units", () => {
    const properties = getPurchaseProperties();
    const openai = toOpenAiEvent("purchase", properties);
    const meta = toMetaEvent("purchase", properties);

    expect(openai?.data.amount).toBe(1499);
    expect(meta?.customData.value).toBe(14.99);
    expect(openai?.data.amount).toBe(toMinorUnits(meta!.customData.value!));
  });
});

describe("minor unit conversion", () => {
  it("converts dollars to cents", () => {
    expect(toMinorUnits(14.99)).toBe(1499);
    expect(toMinorUnits(129.99)).toBe(12999);
  });

  it("avoids floating point drift", () => {
    // 14.99 * 100 is 1498.9999999999998 in IEEE 754.
    expect(toMinorUnits(14.99)).not.toBe(1498);
    expect(toMinorUnits(0)).toBe(0);
  });
});
