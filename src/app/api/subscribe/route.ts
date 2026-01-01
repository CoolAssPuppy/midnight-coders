import { NextResponse } from "next/server";

const KIT_FORM_ID = "8927583";
const KIT_MCC_TAG_ID = "13946969";
const KIT_BETA_TAG_ID = "13946978";

interface SubscribeRequest {
  firstName: string;
  lastName: string;
  email: string;
  referrer: string;
  interestedInBeta: boolean;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRequest(body: unknown): SubscribeRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { firstName, lastName, email, referrer, interestedInBeta } =
    body as Record<string, unknown>;

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

    const { firstName, lastName, email, referrer, interestedInBeta } =
      validatedData;
    const apiKey = process.env.KIT_API_KEY;

    if (!apiKey) {
      console.error("KIT_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const kitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          first_name: firstName,
          fields: {
            last_name: lastName,
            source: "Website",
            referrer: referrer || "",
          },
          tags: [
            KIT_MCC_TAG_ID,
            ...(interestedInBeta ? [KIT_BETA_TAG_ID] : []),
          ],
        }),
      }
    );

    const kitResult = await kitResponse.json();

    if (!kitResponse.ok) {
      console.error("Kit subscription failed:", kitResult);
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
