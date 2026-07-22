import Stripe from "stripe";

/**
 * Lookup key for the digital edition price. The price id itself is never
 * hardcoded, so the price can be edited in the Stripe dashboard without a
 * deploy. Create this in Stripe as a price with lookup key exactly this value.
 */
export const DIGITAL_EDITION_LOOKUP_KEY = "midnight-coders-digital";

/** Release day. Download tokens refuse to serve the file before this. */
export const RELEASE_DATE_ISO = "2026-09-22T00:00:00.000Z";

/**
 * The account-level statement descriptor, set in the Stripe dashboard. Declared
 * here only so the combined length can be checked against Stripe's limit; the
 * API cannot read or write it for your own account.
 */
export const STATEMENT_DESCRIPTOR_PREFIX = "BODHI PRESS";

/**
 * Appended per book, so a buyer sees "BODHI PRESS MIDNIGHT" rather than a bare
 * imprint name they may not recognize. The imprint will carry more titles, and
 * the prefix is account-level and shared by all of them, so the book has to be
 * identified here.
 *
 * Stripe caps the combined "PREFIX SUFFIX" string at 22 characters. With an
 * 11-character prefix that leaves 10. Give each new title its own suffix.
 */
export const STATEMENT_DESCRIPTOR_SUFFIX = "MIDNIGHT";

/** Stripe's hard limit on the concatenated card statement descriptor. */
export const MAX_STATEMENT_DESCRIPTOR_LENGTH = 22;

/**
 * Countries the digital edition can be sold to.
 *
 * Selling digital goods into the EU or UK obliges a non-EU seller to register
 * for VAT from the first sale, with no threshold. Set this to the countries you
 * hold registrations for. `null` means sell worldwide.
 */
export const ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] | null =
  null;

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-06-24.dahlia",
    });
  }

  return stripeClient;
}

/**
 * Resolve a price id from its lookup key. Throws rather than falling back, so a
 * misconfigured Stripe account fails loudly at checkout instead of silently
 * charging the wrong amount.
 */
export async function resolvePriceId(lookupKey: string): Promise<string> {
  const stripe = getStripeClient();
  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    limit: 1,
  });

  const price = prices.data[0];
  if (!price) {
    throw new Error(`No price found for lookup key: ${lookupKey}`);
  }

  return price.id;
}
