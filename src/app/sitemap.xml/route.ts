import { renderSitemapXml } from "@/lib/sitemap-entries";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(renderSitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
