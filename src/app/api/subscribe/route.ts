import { NextResponse } from "next/server";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { subscribeToNewsletter } from "@/lib/beehiiv";
import { sendMetaConversion } from "@/lib/analytics/meta-capi";
import { createEventId } from "@/lib/analytics/meta-events";
import { MARKETING_CONSENT_COOKIE } from "@/lib/consent";

interface SubscribeRequest {
  firstName: string;
  lastName: string;
  email: string;
  referrer: string;
  interestedInBeta: boolean;
  eventId?: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRequest(body: unknown): SubscribeRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const {
    firstName,
    lastName,
    email,
    referrer,
    interestedInBeta,
  } = body as Record<string, unknown>;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string"
  ) {
    return null;
  }

  if (!firstName.trim() || !lastName.trim() || !isValidEmail(email)) {
    return null;
  }

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    referrer: typeof referrer === "string" ? referrer.trim() : "",
    interestedInBeta: interestedInBeta === true,
    eventId:
      typeof (body as Record<string, unknown>).event_id === "string"
        ? String((body as Record<string, unknown>).event_id).slice(0, 80)
        : undefined,
  };
}

function hasMarketingConsentCookie(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return new RegExp(
    `(?:^|;\\s*)${MARKETING_CONSENT_COOKIE}=granted(?:;|$)`,
  ).test(cookie);
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Signups now land active rather than waiting on a confirmation, so this
    // endpoint can add a real address to a real list in one unauthenticated
    // request, and there is no captcha in front of it. Double opt-in means a
    // bad address only ever becomes a pending row that never confirms, but
    // this still bounds how fast one source can create them.
    const rateLimit = applyRateLimit({
      key: `api:subscribe:${getClientIp(request)}`,
      max: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body: unknown = await request.json();
    const validatedData = validateRequest(body);

    if (!validatedData) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, referrer, interestedInBeta, eventId } =
      validatedData;


    const result = await subscribeToNewsletter({
      email,
      firstName,
      lastName,
      referringSite: referrer || undefined,
      utm: { source: "midnightcoderschildren.com", medium: "website" },
      // Forced off, overriding the publication setting. Pending subscribers
      // receive nothing at all from beehiiv until they confirm, and no
      // confirmation email has ever arrived, so deferring to the publication
      // stranded every signup. Active is the state that works today.
      doubleOptIn: "off",
      customFields: {
        "ARC Interest": interestedInBeta ? "yes" : "no",
      },
      // Everyone joins the one book's list. Advance reader copy requests also
      // get "beta", matching how the imported subscribers are tagged, so the
      // two populations segment the same way.
      tags: interestedInBeta ? ["mcc", "beta"] : ["mcc"],
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: result.retryable ? 503 : 500 }
      );
    }

    // beehiiv sends the confirmation and owns the welcome sequence from here,
    // so this route deliberately sends nothing itself.
    //
    // The same response comes back whether the address was new or already on
    // the list, so this endpoint cannot be used to test whether a given person
    // is a subscriber.
    const leadEventId = eventId || createEventId();
    if (hasMarketingConsentCookie(request)) {
      void sendMetaConversion({
        id: leadEventId,
        name: "Lead",
        customData: {},
        sourceUrl: "https://www.midnightcoderschildren.com/",
        email,
        attribution: {
          ipAddress: getClientIp(request),
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed", event_id: leadEventId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
