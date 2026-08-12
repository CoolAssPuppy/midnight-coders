import { markdownForPath } from "@/lib/page-markdown";

/**
 * Markdown representation of any page.
 *
 * The proxy rewrites here when a request carries `Accept: text/markdown`,
 * passing the original pathname through as the catch-all segments. A path
 * without its own markdown falls back to the site index rather than 404ing,
 * because an agent asking for markdown wants something readable more than it
 * wants a status code.
 */

export const dynamic = "force-static";

interface RouteContext {
  params: Promise<{ slug?: string[] }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<Response> {
  const { slug } = await params;
  const pathname = slug?.length ? `/${slug.join("/")}` : "/";

  return new Response(markdownForPath(pathname), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Language": "en",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      Vary: "Accept",
    },
  });
}
