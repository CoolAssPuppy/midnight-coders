import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";

const PROJECT_ID = "d05cbc83-5669-44a1-bd94-e7bbeacfef3a";

interface BetaFeedbackRequest {
  firstName: string;
  lastName: string;
  email: string;
  isTechnical: string;
  technicalThoughts: string;
  timelinePreference: string;
  overallImpressions: string;
  sydneyDescription: string;
  gayathriDescription: string;
  recommendationScore: string;
  audienceThoughts: string;
  autographName: string;
  shippingAddress: string;
  captchaToken: string;
}

function validateRequest(body: unknown): BetaFeedbackRequest | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const data = body as Record<string, unknown>;

  const requiredStrings = [
    "isTechnical",
    "timelinePreference",
    "overallImpressions",
    "sydneyDescription",
    "gayathriDescription",
    "recommendationScore",
    "captchaToken",
  ];

  for (const field of requiredStrings) {
    if (typeof data[field] !== "string" || (data[field] as string).trim() === "") {
      return null;
    }
  }

  const optionalStrings = [
    "firstName",
    "lastName",
    "email",
    "technicalThoughts",
    "audienceThoughts",
    "autographName",
    "shippingAddress",
  ];

  for (const field of optionalStrings) {
    if (data[field] !== undefined && typeof data[field] !== "string") {
      return null;
    }
  }

  return {
    firstName: ((data.firstName as string) || "").trim(),
    lastName: ((data.lastName as string) || "").trim(),
    email: ((data.email as string) || "").trim(),
    isTechnical: (data.isTechnical as string).trim(),
    technicalThoughts: ((data.technicalThoughts as string) || "").trim(),
    timelinePreference: (data.timelinePreference as string).trim(),
    overallImpressions: (data.overallImpressions as string).trim(),
    sydneyDescription: (data.sydneyDescription as string).trim(),
    gayathriDescription: (data.gayathriDescription as string).trim(),
    recommendationScore: (data.recommendationScore as string).trim(),
    audienceThoughts: ((data.audienceThoughts as string) || "").trim(),
    autographName: ((data.autographName as string) || "").trim(),
    shippingAddress: ((data.shippingAddress as string) || "").trim(),
    captchaToken: (data.captchaToken as string).trim(),
  };
}

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("HCAPTCHA_SECRET_KEY environment variable is not set");
    return false;
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return false;
  }
}

function getTimelineLabel(value: string): string {
  const labels: Record<string, string> = {
    sydney: "Present day timeline (Sydney)",
    gayathri: "Past timeline (Gayathri)",
    both: "Both equally",
    neither: "Neither",
  };
  return labels[value] || value;
}

function getReaderName(data: BetaFeedbackRequest): string {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  return fullName || "Anonymous";
}

function buildIssueDescription(data: BetaFeedbackRequest): string {
  const readerName = getReaderName(data);

  const sections = [
    "## Reader information",
    "",
    `- **Name:** ${readerName}`,
  ];

  if (data.email) {
    sections.push(`- **Email:** ${data.email}`);
  }

  sections.push(
    `- **Technical background:** ${data.isTechnical === "yes" ? "Yes" : "No"}`,
    `- **Recommendation score:** ${data.recommendationScore}/10`,
    "",
    "---",
    "",
    "## Timeline preference",
    "",
    getTimelineLabel(data.timelinePreference),
    ""
  );

  if (data.technicalThoughts) {
    sections.push(
      "---",
      "",
      "## Technical thoughts",
      "",
      data.technicalThoughts,
      ""
    );
  }

  sections.push(
    "---",
    "",
    "## Overall impressions",
    "",
    data.overallImpressions,
    "",
    "---",
    "",
    "## Sydney description",
    "",
    data.sydneyDescription,
    "",
    "---",
    "",
    "## Gayathri description",
    "",
    data.gayathriDescription,
    ""
  );

  if (data.audienceThoughts) {
    sections.push(
      "---",
      "",
      "## Audience and marketing thoughts",
      "",
      data.audienceThoughts,
      ""
    );
  }

  if (data.autographName || data.shippingAddress) {
    sections.push(
      "---",
      "",
      "## Autographed copy request",
      "",
      `- **Name for autograph:** ${data.autographName || "Not provided"}`,
      `- **Shipping address:** ${data.shippingAddress || "Not provided"}`,
      ""
    );
  }

  sections.push(
    "---",
    "*Submitted via Beta Reader feedback form*"
  );

  return sections.join("\n");
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

    const captchaValid = await verifyCaptcha(validatedData.captchaToken);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LINEAR_API_KEY;
    const teamId = process.env.LINEAR_TEAM_ID;

    if (!apiKey || !teamId) {
      console.error("LINEAR_API_KEY or LINEAR_TEAM_ID environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const linearClient = new LinearClient({ apiKey });

    const readerName = getReaderName(validatedData);
    const issueTitle = `[Beta Reader] Feedback from ${readerName} (${validatedData.recommendationScore}/10)`;
    const issueDescription = buildIssueDescription(validatedData);

    const issuePayload = await linearClient.createIssue({
      title: issueTitle,
      description: issueDescription,
      teamId,
      projectId: PROJECT_ID,
    });

    if (!issuePayload.success) {
      console.error("Failed to create Linear issue");
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    const issue = await issuePayload.issue;

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted",
        issueId: issue?.identifier,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Beta feedback submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
