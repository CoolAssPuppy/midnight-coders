import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyDownloadToken } from "@/lib/download-token";

/**
 * Token-gated download for the digital edition.
 *
 * The file lives outside `public/` so it is never directly fetchable; it
 * reaches the deployment through `outputFileTracingIncludes` in next.config.ts.
 */
const EBOOK_PATH = "private/ebook/the-midnight-coders-children.epub";
const EBOOK_FILENAME = "The Midnight Coders Children.epub";

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
          message: "This download link has expired. Reply to your receipt and I will send a fresh one.",
        },
        { status: 410 },
      );
    }

    return NextResponse.json({ error: "Invalid download link" }, { status: 404 });
  }

  try {
    const file = await readFile(path.resolve(process.cwd(), EBOOK_PATH));

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "application/epub+zip",
        "Content-Disposition": `attachment; filename="${EBOOK_FILENAME}"`,
        "Content-Length": String(file.byteLength),
        // Never let a CDN or browser cache a per-buyer URL.
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error(`Ebook file unreadable at ${EBOOK_PATH}:`, error);
    return NextResponse.json(
      { error: "The file is temporarily unavailable. Please try again shortly." },
      { status: 500 },
    );
  }
}
