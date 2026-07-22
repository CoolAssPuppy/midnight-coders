/**
 * Mapping from this site's internal analytics events to Meta standard events.
 *
 * Shared by the browser pixel (`destinations/meta.ts`) and the Conversions API
 * (`meta-capi.ts`). Meta deduplicates on the pair (event_name, event_id) within
 * 48 hours, so both halves must agree on both values.
 *
 * See https://developers.facebook.com/docs/meta-pixel/reference
 */

export type MetaEventName =
  | "Purchase"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead";

/** Meta takes major units, unlike OpenAI. $14.99 stays 14.99. */
export interface MetaContentItem {
  id: string;
  quantity: number;
  item_price?: number;
}

export interface MetaCustomData {
  currency?: string;
  value?: number;
  content_type?: string;
  content_ids?: string[];
  contents?: MetaContentItem[];
}

export interface MetaEvent {
  name: MetaEventName;
  customData: MetaCustomData;
  eventId?: string;
}

/**
 * Deliberately parallel to the OpenAI map in `openai-events.ts`: offsite
 * retailer clicks are the *initiate* event, the onsite checkout is the *cart*
 * event, so the two funnels stay separable in both ad managers.
 */
const EVENT_MAP: Record<string, MetaEventName> = {
  purchase: "Purchase",
  begin_checkout: "AddToCart",
  book_retailer_click: "InitiateCheckout",
  newsletter_signup: "Lead",
};

interface EcommercePayload {
  currency?: unknown;
  value?: unknown;
  transaction_id?: unknown;
  items?: unknown;
}

function readEcommerce(
  properties: Record<string, unknown>,
): EcommercePayload | null {
  const ecommerce = properties.ecommerce;
  if (typeof ecommerce !== "object" || ecommerce === null) return null;
  return ecommerce as EcommercePayload;
}

function toContents(items: unknown): MetaContentItem[] | undefined {
  if (!Array.isArray(items) || items.length === 0) return undefined;

  const contents = items.flatMap((entry): MetaContentItem[] => {
    if (typeof entry !== "object" || entry === null) return [];

    const item = entry as Record<string, unknown>;
    if (typeof item.item_id !== "string") return [];

    const content: MetaContentItem = {
      id: item.item_id,
      quantity: typeof item.quantity === "number" ? item.quantity : 1,
    };

    if (typeof item.price === "number") content.item_price = item.price;

    return [content];
  });

  return contents.length > 0 ? contents : undefined;
}

export function toMetaEvent(
  event: string,
  properties: Record<string, unknown>,
): MetaEvent | null {
  const name = EVENT_MAP[event];
  if (!name) return null;

  const customData: MetaCustomData = {};
  const ecommerce = readEcommerce(properties);

  if (ecommerce) {
    if (typeof ecommerce.value === "number") customData.value = ecommerce.value;
    if (typeof ecommerce.currency === "string") {
      customData.currency = ecommerce.currency;
    }

    const contents = toContents(ecommerce.items);
    if (contents) {
      customData.contents = contents;
      customData.content_ids = contents.map((item) => item.id);
      customData.content_type = "product";
    }
  }

  const transactionId = ecommerce?.transaction_id;

  return {
    name,
    customData,
    eventId: typeof transactionId === "string" ? transactionId : undefined,
  };
}
