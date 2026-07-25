import { NextResponse } from "next/server";
import { verifyCaptcha } from "@/lib/captcha";
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

  const { firstName, lastName, email, referrer, interestedInBeta, captchaToken } =
    body as Record<string, unknown>;

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
      customFields: {
        // Advanced Reader Copy interest, previously a Kit tag. Segment on this
        // in beehiiv to pull the ARC list ahead of release.
        "ARC Interest": interestedInBeta ? "yes" : "no",
      },
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
