import { renderRobotsTxt } from "@/lib/robots-rules";

// The rules live in @/lib/robots-rules because Next.js route modules may only
// export handlers and route config, and the rules need to be testable.

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(renderRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
