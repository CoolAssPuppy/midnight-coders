import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";

import { getStripeClient, RELEASE_DATE_ISO } from "@/lib/stripe";
import { createDownloadToken } from "@/lib/download-token";
import { notify } from "@/notifications";

/**
 * Release-day delivery.
 *
 * Stripe is the datastore. Every pre-order is a completed checkout session, so
 * there is nothing to store separately and no list that can drift out of sync
 * with who actually paid.
 *
 * Strictly a courtesy. The token in each buyer's confirmation email is
 * permanent and starts working on its own at midnight, so nothing breaks if
 * this never runs. It exists because someone who paid in July has long since
 * lost that email by September.
 *
 * Safe to run more than once. Each send is keyed on the session id, so a
 * repeat resolves to the original message at the provider rather than mailing
 * anyone twice.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.midnightcoderschildren.com";

const DOWNLOAD_WINDOW_MS = 365 * 24 * 60 * 60 * 1000;

/** Bounded so one invocation cannot run past the function timeout. */
const MAX_SESSIONS = 5000;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  const headerBuffer = Buffer.from(header, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (headerBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(headerBuffer, expectedBuffer);
}

interface Outcome {
  sent: number;
  skipped: number;
  failed: number;
}

async function notifyBuyer(
  session: Stripe.Checkout.Session,
  releaseAt: number,
): Promise<"sent" | "skipped" | "failed"> {
  const email = session.customer_email || session.customer_details?.email;
  if (!email) return "skipped";

  const token = createDownloadToken({
    sessionId: session.id,
    notBefore: releaseAt,
    expiresAt: releaseAt + DOWNLOAD_WINDOW_MS,
  });

  const result = await notify(
    {
      type: "release.available",
      to: email,
      data: {
        firstName: session.customer_details?.name?.split(" ")[0] ?? "",
        downloadUrl: `${SITE_URL}/api/download/${token}`,
        releaseDateIso: RELEASE_DATE_ISO,
      },
    },
    session.id,
  );

  return result.ok ? "sent" : "failed";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const releaseAt = Date.parse(RELEASE_DATE_ISO);

  if (Date.now() < releaseAt) {
    // Guard against an early manual trigger handing out links that will not
    // open yet, which would generate exactly the support mail this whole
    // design is meant to avoid.
    return NextResponse.json(
      { skipped: "before release date", releaseAt: RELEASE_DATE_ISO },
      { status: 200 },
    );
  }

  const stripe = getStripeClient();
  const outcome: Outcome = { sent: 0, skipped: 0, failed: 0 };

  try {
    let seen = 0;

    for await (const session of stripe.checkout.sessions.list({
      limit: 100,
      // Only pre-orders. Anyone buying on or after release day already got a
      // working link in their purchase email.
      created: { lt: Math.floor(releaseAt / 1000) },
    })) {
      if (seen >= MAX_SESSIONS) break;
      seen += 1;

      // A refunded session still reports as paid. At this volume the cost of
      // mailing a refunded buyer a download note is lower than an extra API
      // call per session to check, so this deliberately does not look.
      if (session.payment_status !== "paid") {
        outcome.skipped += 1;
        continue;
      }

      outcome[await notifyBuyer(session, releaseAt)] += 1;
    }
  } catch (error) {
    console.error("Release-day send failed partway:", error);

    // Report what did go out. The run is safe to repeat, so a partial failure
    // is recoverable by triggering it again.
    return NextResponse.json({ ...outcome, error: "partial" }, { status: 500 });
  }

  console.log(
    `Release-day send complete: ${outcome.sent} sent, ${outcome.skipped} skipped, ${outcome.failed} failed`,
  );

  return NextResponse.json(outcome, { status: 200 });
}
