import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

const body = `User-agent: *
Allow: /
Disallow: /api/

Content-Signal: search=yes, ai-input=yes, ai-train=no

Sitemap: ${baseUrl}/sitemap.xml
`;

export function GET(): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
