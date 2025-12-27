import { Resend } from "resend";
import { NextResponse } from "next/server";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

interface SubscribeRequest {
  firstName: string;
  lastName: string;
  email: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRequest(body: unknown): SubscribeRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { firstName, lastName, email } = body as Record<string, unknown>;

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

    const { firstName, lastName, email } = validatedData;
    const resend = getResendClient();
    const segmentId = process.env.RESEND_SEGMENT_ID;
    const apiKey = process.env.RESEND_API_KEY;

    // Add contact to Resend
    try {
      await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          unsubscribed: false,
          segments: segmentId ? [{ id: segmentId }] : undefined,
        }),
      });
    } catch (contactError) {
      // Contact might already exist, continue to send email
      console.error("Contact creation error:", contactError);
    }

    // Send welcome email
    const replyTo = process.env.RESEND_REPLY_TO_EMAIL;
    const { error: emailError } = await resend.emails.send({
      from: "Bodhi Press <hello@emails.midnightcoderschildren.com>",
      to: email,
      replyTo: replyTo || undefined,
      subject: "Welcome to The Midnight Coder's Children",
      react: WelcomeEmail({ firstName }),
    });

    if (emailError) {
      console.error("Email send error:", emailError);
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
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
