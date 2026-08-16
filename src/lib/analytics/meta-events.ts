/**
 * Mapping from this site's internal analytics events to Meta events.
 *
 * Shared by the browser pixel (`destinations/meta.ts`) and the Conversions API
 * (`meta-capi.ts`). Meta deduplicates on the pair (event_name, event_id) within
 * 48 hours, so both halves must agree on both values.
 *
 * Standard events stay on the onsite Stripe path. Outbound retailer clicks are
 * a custom event: they are intent, not a sale, and labeling them
 * InitiateCheckout trains ad delivery on the wrong action.
 *
 * Both paths also emit `PreorderIntent`. Meta can optimize a campaign for only
 * one event, and Stripe volume alone cannot exit learning. That shared custom
 * event is the equal-weight optimization target; InitiateCheckout, RetailerClick,
 * and Purchase stay in the dataset for reporting and for a later Purchase
 * campaign once sales volume exists.
 *
 * See https://developers.facebook.com/docs/meta-pixel/reference
 */

export type MetaStandardEventName =
  | "Purchase"
  | "AddToCart"
  | "InitiateCheckout"
  | "ViewContent"
  | "Lead";

export type MetaCustomEventName = "RetailerClick" | "PreorderIntent";

export type MetaEventName = MetaStandardEventName | MetaCustomEventName;

export type MetaTrackMethod = "track" | "trackCustom";

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
  retailer?: string;
  /** Which buy path produced this event. Used to break down PreorderIntent. */
  channel?: string;
}

export interface MetaEvent {
  name: MetaEventName;
  method: MetaTrackMethod;
  customData: MetaCustomData;
  eventId: string;
}

interface EventMapping {
  name: MetaEventName;
  method: MetaTrackMethod;
}

/**
 * Stripe is the only checkout we can observe through to payment, so it owns
 * the standard funnel events. There is no cart on this site: the buy button
 * opens Stripe Checkout directly, which is InitiateCheckout, not AddToCart.
 *
 * Amazon and Barnes & Noble leave the domain. Those clicks must not share a
 * standard event with Stripe or Meta will optimize for outbound intent as if
 * it were a sale.
 *
 * `PreorderIntent` is the one event both paths share, so a single campaign can
 * treat a Stripe checkout start and a retailer click as equal results.
 */
const EVENT_MAP: Record<string, EventMapping[]> = {
  purchase: [{ name: "Purchase", method: "track" }],
  begin_checkout: [
    { name: "InitiateCheckout", method: "track" },
    { name: "PreorderIntent", method: "trackCustom" },
  ],
  book_retailer_click: [
    { name: "RetailerClick", method: "trackCustom" },
    { name: "PreorderIntent", method: "trackCustom" },
  ],
  view_content: [{ name: "ViewContent", method: "track" }],
  newsletter_signup: [{ name: "Lead", method: "track" }],
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

/** Browser and Node 20+ both provide this. Used for CAPI deduplication. */
export function createEventId(): string {
  return crypto.randomUUID();
}

function resolveEventId(
  properties: Record<string, unknown>,
  ecommerce: EcommercePayload | null,
): string {
  const transactionId = ecommerce?.transaction_id;
  if (typeof transactionId === "string" && transactionId) return transactionId;

  const explicit = properties.event_id;
  if (typeof explicit === "string" && explicit) return explicit;

  return createEventId();
}

function buildBaseCustomData(
  event: string,
  properties: Record<string, unknown>,
  ecommerce: EcommercePayload | null,
): MetaCustomData {
  const customData: MetaCustomData = {};

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

  if (typeof properties.retailer === "string") {
    customData.retailer = properties.retailer;
  }

  if (event === "begin_checkout") {
    customData.channel = "stripe";
  } else if (event === "book_retailer_click" && customData.retailer) {
    customData.channel = customData.retailer;
  }

  return customData;
}

/**
 * Shape each Meta event so reporting events stay specific and the shared
 * optimization event stays a count signal, not a revenue signal.
 *
 * RetailerClick keeps only `retailer`. PreorderIntent keeps channel (and
 * retailer when present) plus value/currency when the Stripe path already
 * has them. Putting a made-up price on an Amazon click would train value
 * optimization on fiction.
 */
function customDataFor(
  name: MetaEventName,
  base: MetaCustomData,
): MetaCustomData {
  if (name === "RetailerClick") {
    return base.retailer ? { retailer: base.retailer } : {};
  }

  if (name === "PreorderIntent") {
    const data: MetaCustomData = {};
    if (base.channel) data.channel = base.channel;
    if (base.retailer) data.retailer = base.retailer;
    if (typeof base.value === "number") data.value = base.value;
    if (base.currency) data.currency = base.currency;
    return data;
  }

  return base;
}

export function toMetaEvents(
  event: string,
  properties: Record<string, unknown>,
): MetaEvent[] {
  const mappings = EVENT_MAP[event];
  if (!mappings) return [];

  const ecommerce = readEcommerce(properties);
  const base = buildBaseCustomData(event, properties, ecommerce);

  return mappings.map((mapping) => ({
    name: mapping.name,
    method: mapping.method,
    customData: customDataFor(mapping.name, base),
    // Only Purchase reuses the Stripe session id. Fan-out events each need
    // their own id so Meta does not collapse InitiateCheckout into PreorderIntent.
    eventId:
      mapping.name === "Purchase"
        ? resolveEventId(properties, ecommerce)
        : createEventId(),
  }));
}

/** Primary (first) mapping. Prefer `toMetaEvents` when a path fans out. */
export function toMetaEvent(
  event: string,
  properties: Record<string, unknown>,
): MetaEvent | null {
  return toMetaEvents(event, properties)[0] ?? null;
}
