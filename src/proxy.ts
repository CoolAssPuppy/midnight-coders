import { NextResponse, type NextRequest } from "next/server";

const LINK_HEADERS = [
  '</llms.txt>; rel="alternate"; type="text/plain"; title="LLM context"',
  '</llms-full.txt>; rel="alternate"; type="text/plain"; title="Full LLM content"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
].join(", ");

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const normalized = accept.toLowerCase();
  if (!normalized.includes("text/markdown")) return false;
  if (normalized.includes("text/html")) return false;
  return true;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === "/" && prefersMarkdown(request.headers.get("accept"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/api/md";
    const response = NextResponse.rewrite(url);
    response.headers.set("Vary", "Accept");
    return response;
  }

  const response = NextResponse.next();

  if (pathname === "/") {
    response.headers.set("Link", LINK_HEADERS);
  }

  return response;
}

export const config = {
  matcher: ["/"],
};
