import { createPricingMarkdown } from "@/lib/pricing";

// Agent-readable price list, in the same set as llms.txt and openapi.json.

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(createPricingMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Language": "en",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
