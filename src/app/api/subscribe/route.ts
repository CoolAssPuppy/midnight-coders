import { NextResponse } from "next/server";
import { verifyCaptcha } from "@/lib/captcha";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { subscribeToNewsletter } from "@/lib/beehiiv";

interface SubscribeRequest {
  firstName: string;
  lastName: string;
  email: string;
  referrer: string;
  interestedInBeta: boolean;
  captchaToken: string;
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
    captchaToken,
  } = body as Record<string, unknown>;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof captchaToken !== "string"
  ) {
    return null;
  }

  if (!firstName.trim() || !lastName.trim() || !isValidEmail(email) || !captchaToken.trim()) {
    return null;
  }

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    referrer: typeof referrer === "string" ? referrer.trim() : "",
    interestedInBeta: interestedInBeta === true,
    captchaToken: captchaToken.trim(),
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Signups now land active rather than waiting on a confirmation, so this
    // endpoint can add a real address to a real list in one unauthenticated
    // request. The captcha stops scripted abuse; this bounds what a human
    // driving a browser can do.
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

    const { firstName, lastName, email, referrer, interestedInBeta, captchaToken } =
      validatedData;

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    const result = await subscribeToNewsletter({
      email,
      firstName,
      lastName,
      referringSite: referrer || undefined,
      utm: { source: "midnightcoderschildren.com", medium: "website" },
      // Left to the publication's own double opt-in setting, which sends a
      // branded confirmation email and holds the subscriber pending until they
      // click it. That click is the consent record, and it verifies the person
      // controls the address, which a checkbox on this site cannot.
      doubleOptIn: "not_set",
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
    return NextResponse.json(
      { success: true, message: "Successfully subscribed" },
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
