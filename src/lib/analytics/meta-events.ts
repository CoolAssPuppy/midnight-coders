/**
 * Mapping from this site's internal analytics events to Meta events.
 *
 * Shared by the browser pixel (`destinations/meta.ts`) and the Conversions API
 * (`meta-capi.ts`). Meta deduplicates on the pair (event_name, event_id) within
 * 48 hours, so both halves must agree on both values.
 *
 * Amazon paperback clicks share InitiateCheckout with the Stripe EPUB path.
 * Barnes & Noble stays on RetailerClick. Both still emit PreorderIntent so a
 * paused campaign that already optimizes on that custom event keeps its signal.
 *
 * See https://developers.facebook.com/docs/meta-pixel/reference
 */

export type MetaStandardEventName =
  | "Purchase"
  | "AddToCart"
  | "InitiateCheckout"
  | "ViewContent"
  | "Lead"
  | "PageView";

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
  content_name?: string;
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
 * Stripe EPUB checkout and Amazon paperback clicks both emit InitiateCheckout.
 * Barnes & Noble stays on RetailerClick. There is no cart: the buy button is
 * the checkout start.
 *
 * `PreorderIntent` remains on both paid paths so existing paused ad sets that
 * already listen for it keep a comparable count.
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

function mappingsFor(
  event: string,
  properties: Record<string, unknown>,
): EventMapping[] | undefined {
  if (event === "book_retailer_click" && properties.retailer === "amazon") {
    return [
      { name: "InitiateCheckout", method: "track" },
      { name: "PreorderIntent", method: "trackCustom" },
    ];
  }
  return EVENT_MAP[event];
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

  if (typeof properties.content_name === "string") {
    customData.content_name = properties.content_name;
  } else if (ecommerce?.items && Array.isArray(ecommerce.items)) {
    const first = ecommerce.items[0];
    if (
      typeof first === "object" &&
      first !== null &&
      typeof (first as { item_name?: unknown }).item_name === "string"
    ) {
      customData.content_name = (first as { item_name: string }).item_name;
    }
  }

  if (
    !customData.content_ids &&
    typeof properties.item_id === "string" &&
    properties.item_id
  ) {
    customData.content_ids = [properties.item_id];
    customData.content_type = "product";
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
  const mappings = mappingsFor(event, properties);
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
