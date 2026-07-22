import { NextResponse } from "next/server";
import { verifyCaptcha } from "@/lib/captcha";
import {
  subscribeToForm,
  KIT_FORM_ID,
  KIT_MCC_TAG_ID,
  // Also used to route Advanced Reader Copy (ARC) requests from the signup form.
  KIT_BETA_TAG_ID,
} from "@/lib/kit";

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

    if (!process.env.KIT_API_KEY) {
      console.error("KIT_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      await subscribeToForm({
        email,
        firstName,
        formId: KIT_FORM_ID,
        fields: {
          last_name: lastName,
          source: "Website",
          referrer: referrer || "",
        },
        tagIds: [
          KIT_MCC_TAG_ID,
          ...(interestedInBeta ? [KIT_BETA_TAG_ID] : []),
        ],
      });
    } catch (error) {
      console.error("Kit subscription failed:", error);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

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
