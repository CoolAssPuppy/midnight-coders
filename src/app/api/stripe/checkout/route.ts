import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  getStripeClient,
  resolvePriceId,
  DIGITAL_EDITION_LOOKUP_KEY,
  ALLOWED_COUNTRIES,
  STATEMENT_DESCRIPTOR_SUFFIX,
} from "@/lib/stripe";
import { readRefsFromCookies, toStripeMetadata } from "@/lib/analytics/ad-refs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.midnightcoderschildren.com";

/**
 * Whether the buyer left the newsletter box ticked.
 *
 * Stripe's own consent checkbox cannot be pre-checked, cannot be reworded, and
 * only renders for US customers, so buyers elsewhere could never opt in. The
 * choice is collected on this site instead and carried through metadata.
 */
function readOptIn(value: unknown): string {
  return value === false ? "false" : "true";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // The only field this endpoint accepts. A malformed body is not worth
  // failing a purchase over, so it falls back to opted in.
  const { newsletterOptIn, betaReader } = await request
    .json()
    .catch(() => ({ newsletterOptIn: true, betaReader: false }));

  try {
    const rateLimit = applyRateLimit({
      key: `api:digital-checkout:${getClientIp(request)}`,
      max: 10,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    const stripe = getStripeClient();
    const priceId = await resolvePriceId(DIGITAL_EDITION_LOOKUP_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/buy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/buy`,

      // Stripe Tax. The price is configured tax-inclusive, so the buyer always
      // pays exactly $14.99 and VAT comes out of that.
      automatic_tax: { enabled: true },

      // The account descriptor is the imprint, which will carry other titles.
      // Naming the book here is what stops a buyer seeing an unfamiliar line on
      // their statement and calling their bank.
      payment_intent_data: {
        statement_descriptor_suffix: STATEMENT_DESCRIPTOR_SUFFIX,
      },

      // A billing address is required to determine VAT jurisdiction. There is
      // no shipping address because nothing ships.
      billing_address_collection: "required",
      ...(ALLOWED_COUNTRIES
        ? { shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES } }
        : {}),

      // Stripe emails the receipt, which is where the pre-order terms live.
      custom_text: {
        submit: {
          message:
            "Pre-order. Your download link arrives by email now and unlocks on release day, 15 September 2026.",
        },
      },

      metadata: {
        productType: "digital-edition",
        newsletter_opt_in: readOptIn(newsletterOptIn),
        beta_reader: betaReader === true ? "true" : "false",
        // Captured here because this is the last request that still carries the
        // browser's cookies, IP, and user agent. The webhook has none of them.
        ...toStripeMetadata({
          ...readRefsFromCookies(
            (name) => request.cookies.get(name)?.value,
          ),
          ipAddress: getClientIp(request),
          userAgent: request.headers.get("user-agent") ?? undefined,
        }),
      },

      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating digital edition checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
