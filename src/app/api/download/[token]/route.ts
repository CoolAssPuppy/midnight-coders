import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyDownloadToken } from "@/lib/download-token";
import { readR2Config, presignEbookUrl } from "@/lib/r2";

/**
 * Token-gated download for the digital edition.
 *
 * The file lives in a private R2 bucket. This route verifies the buyer's signed
 * token, checks the release date, then redirects to a short-lived presigned URL.
 * The bytes never pass through this function.
 */

function releaseDateLabel(notBefore: number): string {
  return new Date(notBefore).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  // Bound brute-force attempts against the HMAC.
  const rateLimit = applyRateLimit({
    key: `api:download:${getClientIp(request)}`,
    max: 30,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many download attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const { token } = await params;
  const verification = verifyDownloadToken(token);

  if (!verification.valid) {
    if (verification.reason === "not_yet_valid" && verification.payload) {
      // The signature checked out, so this is a real buyer who is simply early.
      return NextResponse.json(
        {
          error: "Not yet available",
          message: `Your copy unlocks on ${releaseDateLabel(verification.payload.notBefore)}. This link will keep working, so hold on to it.`,
        },
        { status: 425 },
      );
    }

    if (verification.reason === "expired") {
      return NextResponse.json(
        {
          error: "Link expired",
          message:
            "This download link has expired. Reply to your receipt and I will send a fresh one.",
        },
        { status: 410 },
      );
    }

    return NextResponse.json({ error: "Invalid download link" }, { status: 404 });
  }

  const configResult = readR2Config();

  if (!configResult.ok) {
    // A paying customer is standing at this door, so say exactly what is
    // unconfigured rather than a generic failure.
    console.error(
      `Download blocked, R2 not configured. Missing: ${configResult.missing.join(", ")}`,
    );
    return NextResponse.json(
      { error: "The file is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }

  try {
    const url = await presignEbookUrl(configResult.config);

    // 302 rather than 307: this is a GET either way, and 302 is the better
    // understood status for a temporary handoff to storage.
    const response = NextResponse.redirect(url, 302);
    // Never let a CDN or browser cache a per-buyer redirect to a URL that
    // expires in minutes.
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error(`Failed to presign R2 URL for session ${verification.payload.sessionId}:`, error);
    return NextResponse.json(
      { error: "The file is temporarily unavailable. Please try again shortly." },
      { status: 500 },
    );
  }
}
