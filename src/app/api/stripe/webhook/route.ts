import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getReceiptUrl, getStripeClient, RELEASE_DATE_ISO } from "@/lib/stripe";
import { subscribeToNewsletter } from "@/lib/beehiiv";
import { createDownloadToken } from "@/lib/download-token";
import { notify } from "@/notifications";
import { formatAmount } from "@/notifications/templates/_components/theme";
import { fromStripeMetadata } from "@/lib/analytics/ad-refs";
import { sendOpenAiConversion } from "@/lib/analytics/openai-capi";
import { sendMetaConversion } from "@/lib/analytics/meta-capi";
import { PRODUCTS } from "@/lib/analytics/products";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.midnightcoderschildren.com";

/** How long a download link stays valid after release day. */
const DOWNLOAD_WINDOW_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Deliver the book by emailing the buyer their personal download link.
 *
 * Delivery used to run through Kit: the URL went into a custom field and a Kit
 * automation, triggered by a purchase tag, sent the mail. That made a paid
 * product depend on a marketing tool. The notification engine now sends it
 * directly, and no Kit tag is applied any more, so the old automation cannot
 * fire a duplicate even if it is still switched on over there.
 *
 * The buyer is still added to the newsletter afterwards, which is list
 * membership rather than delivery.
 */
async function deliverToBuyer(
  session: Stripe.Checkout.Session,
  email: string,
): Promise<void> {
  const releaseAt = Date.parse(RELEASE_DATE_ISO);

  const token = createDownloadToken({
    sessionId: session.id,
    notBefore: releaseAt,
    expiresAt: releaseAt + DOWNLOAD_WINDOW_MS,
  });

  const firstName = session.customer_details?.name?.split(" ")[0] ?? "";
  const downloadUrl = `${SITE_URL}/api/download/${token}`;
  const purchasedOn = new Date(session.created * 1000).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );
  const amount = formatAmount(session.amount_total, session.currency);

  // Stripe has no PDF for a one-time payment, only a hosted receipt page.
  const receiptUrl = await getReceiptUrl(session.id);

  // Before release day the link exists but refuses to open, so the buyer needs
  // to be told that plainly rather than handed a link that looks broken.
  const result =
    Date.now() < releaseAt
      ? await notify(
          {
            type: "preorder.confirmed",
            to: email,
            data: {
              firstName,
              downloadUrl,
              releaseDateIso: RELEASE_DATE_ISO,
              amount,
              orderReference: session.id,
              purchasedOn,
              receiptUrl,
            },
          },
          session.id,
        )
      : await notify(
          {
            type: "purchase.delivered",
            to: email,
            data: {
              firstName,
              downloadUrl,
              amount,
              orderReference: session.id,
              purchasedOn,
              receiptUrl,
            },
          },
          session.id,
        );

  if (!result.ok) {
    throw new Error(`Notification failed: ${result.error}`);
  }

  // Newsletter membership only, and only for buyers who ticked the opt-in box
  // on the Stripe page. Everyone gets their book regardless; this is the
  // marketing list, and joining it is the buyer's choice to make.
  //
  // Never allowed to fail the delivery: this runs after the email and discards
  // its own error. No confirmation step and no welcome email, because they
  // consented explicitly a moment ago and are already receiving their book.
  // Collected by a checkbox on this site rather than by Stripe, whose own
  // consent control cannot be pre-checked and never renders outside the US.
  if (session.metadata?.newsletter_opt_in !== "true") {
    return;
  }

  const listed = await subscribeToNewsletter({
    email,
    firstName,
    doubleOptIn: "off",
    sendWelcomeEmail: false,
    utm: { source: "midnightcoderschildren.com", medium: "purchase" },
    customFields: {
      "ARC Interest": session.metadata?.beta_reader === "true" ? "yes" : "no",
    },
    // Advance reader copy is opt-in on the buy page, so it is only applied
    // when asked for. Nothing added it before, which meant pre-order buyers
    // could not volunteer at all.
    tags:
      session.metadata?.beta_reader === "true"
        ? ["mcc", "digital", "beta"]
        : ["mcc", "digital"],
  });

  if (!listed.ok) {
    console.error(
      `beehiiv subscribe failed for session ${session.id}: ${listed.error}`,
    );
  }
}

/**
 * Report the sale to both ad platforms from the server.
 *
 * The Stripe session id is the shared event id, so if the browser pixel also
 * fired on the success page each platform collapses the pair into one
 * conversion. Neither call throws.
 */
async function reportConversions(
  session: Stripe.Checkout.Session,
  email: string | undefined,
): Promise<void> {
  const attribution = fromStripeMetadata(session.metadata);
  const sourceUrl = `${SITE_URL}/buy/success`;
  const product = PRODUCTS.digitalEdition;

  // Stripe reports totals in minor units already. amount_total reflects what
  // was actually charged, after any discount.
  const minorUnits = session.amount_total ?? undefined;
  const currency = session.currency?.toUpperCase();

  await Promise.allSettled([
    sendOpenAiConversion({
      id: session.id,
      name: "order_created",
      dataType: "contents",
      amount: minorUnits,
      currency,
      contents: [
        {
          id: product.item_id,
          name: product.item_name,
          content_type: product.item_category,
          quantity: 1,
          amount: minorUnits,
          currency,
        },
      ],
      sourceUrl,
      email,
      attribution,
    }),
    sendMetaConversion({
      id: session.id,
      name: "Purchase",
      // Meta wants major units, unlike OpenAI.
      customData: {
        value: minorUnits !== undefined ? minorUnits / 100 : undefined,
        currency,
        content_type: "product",
        content_ids: [product.item_id],
        contents: [{ id: product.item_id, quantity: 1 }],
      },
      sourceUrl,
      email,
      attribution,
    }),
  ]);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const stripe = getStripeClient();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature provided" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.customer_details?.email;

    // Every side effect is individually caught. This handler must always
    // return 2xx: a non-2xx makes Stripe retry the whole delivery, which would
    // email the buyer their download link a second time.
    if (email) {
      try {
        await deliverToBuyer(session, email);
        console.log(`Delivered digital edition to ${email} (${session.id})`);
      } catch (error) {
        // Loud, because this one means a paying customer got nothing.
        console.error(
          `DELIVERY FAILED for ${email}, session ${session.id}:`,
          error,
        );
      }
    } else {
      console.error(`Purchase completed with no email: ${session.id}`);
    }

    try {
      await reportConversions(session, email ?? undefined);
    } catch (error) {
      console.error(`Conversion reporting failed for ${session.id}:`, error);
    }
  }

  return NextResponse.json({ received: true });
}
