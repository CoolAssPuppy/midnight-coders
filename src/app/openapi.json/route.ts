import { createOpenApiDocument } from "@/lib/openapi";

// OpenAPI 3.1 description of the public read-only endpoints. Advertised from
// /.well-known/api-catalog and /developers.

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(JSON.stringify(createOpenApiDocument(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
