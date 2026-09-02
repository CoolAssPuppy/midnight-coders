import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendMetaConversion } from "@/lib/analytics/meta-capi";
import { readRefsFromCookies } from "@/lib/analytics/ad-refs";
import type { MetaEventName, MetaCustomData } from "@/lib/analytics/meta-events";

const ALLOWED_EVENTS = new Set<MetaEventName>([
  "PageView",
  "ViewContent",
  "Lead",
  "InitiateCheckout",
  "RetailerClick",
  "PreorderIntent",
]);

/**
 * Browser-to-CAPI mirror.
 *
 * The pixel sends the same event_id. Meta deduplicates the pair. If
 * META_CAPI_ACCESS_TOKEN is missing this route still returns 200 and no-ops,
 * so a missing token never breaks a click.
 *
 * Purchase is not accepted here. The Stripe webhook owns that conversion.
 */

function isEventName(value: unknown): value is MetaEventName {
  return typeof value === "string" && ALLOWED_EVENTS.has(value as MetaEventName);
}

function sanitizeCustomData(input: unknown): MetaCustomData {
  if (typeof input !== "object" || input === null) return {};
  const raw = input as Record<string, unknown>;
  const data: MetaCustomData = {};

  if (typeof raw.value === "number" && Number.isFinite(raw.value)) {
    data.value = raw.value;
  }
  if (typeof raw.currency === "string") data.currency = raw.currency.slice(0, 8);
  if (typeof raw.content_type === "string") {
    data.content_type = raw.content_type.slice(0, 40);
  }
  if (typeof raw.content_name === "string") {
    data.content_name = raw.content_name.slice(0, 200);
  }
  if (Array.isArray(raw.content_ids)) {
    data.content_ids = raw.content_ids
      .filter((id): id is string => typeof id === "string")
      .map((id) => id.slice(0, 80))
      .slice(0, 10);
  }
  if (typeof raw.retailer === "string") data.retailer = raw.retailer.slice(0, 40);
  if (typeof raw.channel === "string") data.channel = raw.channel.slice(0, 40);

  return data;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rateLimit = applyRateLimit({
    key: `api:capi:meta:${getClientIp(request)}`,
    max: 40,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { sent: false, skipped: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  if (!isEventName(payload.name)) {
    return NextResponse.json({ error: "Unsupported event" }, { status: 400 });
  }
  if (typeof payload.event_id !== "string" || !payload.event_id) {
    return NextResponse.json({ error: "Missing event_id" }, { status: 400 });
  }

  const sourceUrl =
    typeof payload.source_url === "string" && payload.source_url.startsWith("http")
      ? payload.source_url.slice(0, 500)
      : request.headers.get("referer") || "https://www.midnightcoderschildren.com/";

  const refs = readRefsFromCookies((name) => request.cookies.get(name)?.value);

  const result = await sendMetaConversion({
    id: payload.event_id.slice(0, 80),
    name: payload.name,
    customData: sanitizeCustomData(payload.custom_data),
    sourceUrl,
    attribution: {
      ...refs,
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
  });

  return NextResponse.json({ sent: result.sent, skipped: result.skipped ?? null });
}
