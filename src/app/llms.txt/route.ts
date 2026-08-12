import { createLlmsIndex } from "@/lib/llms";

// Generated from @/lib/llms rather than served as a static file, so the page
// list and prices cannot drift from the site that ships them.

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(createLlmsIndex(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Language": "en",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
