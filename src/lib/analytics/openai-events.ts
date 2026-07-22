/**
 * Mapping from this site's internal analytics events to OpenAI Ads events.
 *
 * Shared by the browser pixel (`destinations/openai.ts`) and the server-side
 * Conversions API (`openai-capi.ts`), so a browser event and its server twin
 * cannot drift apart. That is what makes `event_id` deduplication work.
 *
 * See https://developers.openai.com/ads/supported-events
 */

export type OpenAiEventName =
  | "order_created"
  | "items_added"
  | "checkout_started"
  | "contents_viewed"
  | "lead_created";

/** The payload category, which is distinct from the event name. */
export type OpenAiDataType = "contents" | "customer_action";

/** One line item. Every field is optional, but unknown fields are rejected. */
export interface OpenAiContentItem {
  id?: string;
  name?: string;
  content_type?: string;
  quantity?: number;
  /** ISO 4217 minor units, per unit. */
  amount?: number;
  currency?: string;
}

export interface OpenAiEventData {
  type: OpenAiDataType;
  /** ISO 4217 minor units. $14.99 is 1499. */
  amount?: number;
  currency?: string;
  contents?: OpenAiContentItem[];
}

export interface OpenAiEvent {
  name: OpenAiEventName;
  data: OpenAiEventData;
  eventId?: string;
}

interface EventMapping {
  name: OpenAiEventName;
  type: OpenAiDataType;
}

/**
 * `book_retailer_click` maps to `checkout_started` because clicking through to
 * Amazon or Barnes & Noble is a reader starting a purchase, just on a checkout
 * we do not own. It is the highest-volume intent signal available and the
 * intended campaign optimization target.
 *
 * The onsite checkout therefore maps to `items_added`. Sharing
 * `checkout_started` between the two would blend the offsite and onsite funnels
 * into one number Ads Manager cannot segment apart.
 */
const EVENT_MAP: Record<string, EventMapping> = {
  purchase: { name: "order_created", type: "contents" },
  begin_checkout: { name: "items_added", type: "contents" },
  book_retailer_click: { name: "checkout_started", type: "contents" },
  view_content: { name: "contents_viewed", type: "contents" },
  newsletter_signup: { name: "lead_created", type: "customer_action" },
};

/**
 * Convert a major-unit amount to ISO 4217 minor units.
 * Rounds to avoid float artifacts: 14.99 * 100 is 1498.9999... in IEEE 754.
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

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

/**
 * Translate GA4-shaped items into OpenAI content items. Field names differ in
 * every position except quantity, and `price` is major units on our side while
 * `amount` is minor units on theirs. The API rejects unknown field names, so
 * this maps explicitly rather than spreading.
 */
function toContents(items: unknown): OpenAiContentItem[] | undefined {
  if (!Array.isArray(items) || items.length === 0) return undefined;

  const contents = items.flatMap((entry): OpenAiContentItem[] => {
    if (typeof entry !== "object" || entry === null) return [];

    const item = entry as Record<string, unknown>;
    const content: OpenAiContentItem = {};

    if (typeof item.item_id === "string") content.id = item.item_id;
    if (typeof item.item_name === "string") content.name = item.item_name;
    if (typeof item.item_category === "string") {
      content.content_type = item.item_category;
    }
    if (typeof item.quantity === "number") content.quantity = item.quantity;
    if (typeof item.price === "number") content.amount = toMinorUnits(item.price);
    if (typeof item.currency === "string") content.currency = item.currency;

    return Object.keys(content).length > 0 ? [content] : [];
  });

  return contents.length > 0 ? contents : undefined;
}

export function toOpenAiEvent(
  event: string,
  properties: Record<string, unknown>,
): OpenAiEvent | null {
  const mapping = EVENT_MAP[event];
  if (!mapping) return null;

  const data: OpenAiEventData = { type: mapping.type };
  const ecommerce = readEcommerce(properties);

  if (ecommerce) {
    if (typeof ecommerce.value === "number") {
      data.amount = toMinorUnits(ecommerce.value);
    }
    if (typeof ecommerce.currency === "string") {
      data.currency = ecommerce.currency;
    }

    // `customer_action` payloads accept only amount and currency.
    if (mapping.type === "contents") {
      const contents = toContents(ecommerce.items);
      if (contents) data.contents = contents;
    }
  }

  const transactionId = ecommerce?.transaction_id;

  return {
    name: mapping.name,
    data,
    eventId: typeof transactionId === "string" ? transactionId : undefined,
  };
}
