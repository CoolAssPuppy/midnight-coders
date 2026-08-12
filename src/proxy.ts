import { NextResponse, type NextRequest } from "next/server";

const LINK_HEADERS = [
  '</llms.txt>; rel="alternate"; type="text/markdown"; title="LLM context"',
  '</llms-full.txt>; rel="alternate"; type="text/plain"; title="Full LLM content"',
  '</pricing.md>; rel="alternate"; type="text/markdown"; title="Pricing"',
  '</openapi.json>; rel="service-desc"; type="application/json"; title="OpenAPI description"',
  '</developers>; rel="service-doc"; type="text/html"; title="Developer and agent docs"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
].join(", ");

/**
 * Content Security Policy.
 *
 * Every host here is one the site actually loads from. Grouped by what pulls
 * it in so a removed integration means a removed line rather than a guess:
 *
 *   Google Tag Manager and GA4 - googletagmanager.com, google-analytics.com
 *   Meta Pixel                 - connect.facebook.net, facebook.com
 *   OpenAI ads pixel           - bzr.openai.com, bzrcdn.openai.com
 *   Stripe Checkout            - js.stripe.com, api.stripe.com
 *   hCaptcha on the signup     - hcaptcha.com and its subdomains
 *   Vercel analytics           - va.vercel-scripts.com
 *   PostHog                    - proxied through /ingest, so 'self' covers it
 *
 * 'unsafe-inline' and 'unsafe-eval' are present because GTM injects both. That
 * is the cost of running a tag manager, and it is why the policy still pins
 * every other directive tightly.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.facebook.net https://bzr.openai.com https://bzrcdn.openai.com https://js.stripe.com https://*.hcaptcha.com https://hcaptcha.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://*.hcaptcha.com https://hcaptcha.com",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  // GA4 does not post to www.google-analytics.com. It picks a regional
  // endpoint at runtime (region1.google-analytics.com and friends) and also
  // uses analytics.google.com, so both need wildcards or every pageview is
  // silently dropped by the policy.
  "connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.facebook.com https://bzr.openai.com https://bzrcdn.openai.com https://api.stripe.com https://*.hcaptcha.com https://hcaptcha.com https://vitals.vercel-insights.com",
  // The Meta pixel does not only use the image beacon. Depending on the
  // per-pixel config Meta serves, it falls back to POSTing a form to
  // facebook.com/tr and to an iframe on facebook.com for cookie sync. With
  // those two blocked, this pixel sent nothing at all: the script loaded, the
  // config loaded, and then every transport it tried was refused.
  "frame-src 'self' https://js.stripe.com https://*.hcaptcha.com https://hcaptcha.com https://www.googletagmanager.com https://*.facebook.com",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com https://www.facebook.com",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * True when the client wants markdown rather than the rendered page.
 *
 * Browsers send `text/html` in Accept, so requiring its absence is what keeps
 * a normal page load from being rewritten to the markdown route.
 */
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const normalized = accept.toLowerCase();
  if (!normalized.includes("text/markdown")) return false;
  if (normalized.includes("text/html")) return false;
  return true;
}

function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // upgrade-insecure-requests rewrites every subresource to HTTPS, which
  // breaks local development over plain HTTP.
  if (process.env.NODE_ENV !== "development") {
    response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  }
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Markdown negotiation used to answer on the homepage only, and then with
  // the site index for every path. Each page now has its own markdown, built
  // in @/lib/page-markdown from the same modules the page renders.
  //
  // /excerpt is excluded on purpose. It carries Chapter 1 in full, and handing
  // that over as clean markdown is the opposite of what ai-train=no and the
  // terms page say. Agents can still read the HTML like anyone else.
  const negotiable = !pathname.startsWith("/excerpt");

  if (negotiable && prefersMarkdown(request.headers.get("accept"))) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/md${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set("Vary", "Accept");
    response.headers.set("Content-Language", "en");
    applySecurityHeaders(response);
    return response;
  }

  const response = NextResponse.next();

  // No Vary: Accept on this branch, and it is not an oversight. Next.js
  // rewrites Vary after middleware to carry its own RSC routing values, so
  // neither this layer nor next.config can add to it on a prerendered page.
  //
  // It does not matter here. Middleware runs before the cache lookup, so the
  // markdown request is already rewritten to /api/md/... by the time anything
  // is cached, and the two representations occupy separate entries under
  // separate paths. Responses reach clients as max-age=0, must-revalidate, so
  // intermediate caches revalidate rather than guess.
  response.headers.set("Content-Language", "en");
  applySecurityHeaders(response);

  if (pathname === "/") {
    response.headers.set("Link", LINK_HEADERS);
  }

  return response;
}

export const config = {
  matcher: [
    // Every page, minus Next internals, static assets, and the API itself.
    "/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|mp4)$).*)",
  ],
};
