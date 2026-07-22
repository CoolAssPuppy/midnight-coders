import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient, RELEASE_DATE_ISO } from "@/lib/stripe";
import {
  subscribeToForm,
  KIT_MCC_TAG_ID,
  KIT_DIGITAL_PURCHASE_TAG_ID,
} from "@/lib/kit";
import { createDownloadToken } from "@/lib/download-token";
import { fromStripeMetadata } from "@/lib/analytics/ad-refs";
import { sendOpenAiConversion } from "@/lib/analytics/openai-capi";
import { sendMetaConversion } from "@/lib/analytics/meta-capi";
import { PRODUCTS } from "@/lib/analytics/products";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.midnightcoderschildren.com";

/** How long a download link stays valid after release day. */
const DOWNLOAD_WINDOW_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Deliver the book by tagging the buyer in Kit with their personal download URL
 * in a custom field. A Kit automation triggered by the purchase tag sends the
 * email and merges `{{ subscriber.download_url }}`.
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

  const tagIds = [KIT_MCC_TAG_ID];
  if (KIT_DIGITAL_PURCHASE_TAG_ID) tagIds.push(KIT_DIGITAL_PURCHASE_TAG_ID);

  await subscribeToForm({
    email,
    firstName: session.customer_details?.name?.split(" ")[0] ?? "",
    tagIds,
    fields: {
      download_url: `${SITE_URL}/api/download/${token}`,
      purchase_source: "direct-digital",
    },
  });
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
