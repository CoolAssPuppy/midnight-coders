import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

const linkset = {
  linkset: [
    {
      anchor: `${baseUrl}/`,
      "service-doc": [
        {
          href: `${baseUrl}/llms.txt`,
          type: "text/plain",
          title: "LLM context file",
        },
      ],
    },
    {
      anchor: `${baseUrl}/llms.txt`,
      describedby: [
        {
          href: `${baseUrl}/`,
          type: "text/html",
        },
      ],
      type: [{ href: "text/plain" }],
    },
    {
      anchor: `${baseUrl}/llms-full.txt`,
      describedby: [
        {
          href: `${baseUrl}/`,
          type: "text/html",
        },
      ],
      type: [{ href: "text/plain" }],
    },
    {
      anchor: `${baseUrl}/pricing.md`,
      "service-doc": [
        {
          href: `${baseUrl}/buy`,
          type: "text/html",
          title: "Buy the book (human-readable)",
        },
      ],
      type: [{ href: "text/markdown" }],
    },
    {
      anchor: `${baseUrl}/openapi.json`,
      "service-doc": [
        {
          href: `${baseUrl}/developers`,
          type: "text/html",
          title: "Developer and agent documentation",
        },
      ],
      "service-desc": [
        {
          href: `${baseUrl}/openapi.json`,
          type: "application/json",
          title: "OpenAPI 3.1 description of the public endpoints",
        },
      ],
      type: [{ href: "application/json" }],
    },
    {
      anchor: `${baseUrl}/sitemap.xml`,
      type: [{ href: "application/xml" }],
    },
    {
      anchor: `${baseUrl}/api/md`,
      "service-doc": [
        {
          href: `${baseUrl}/`,
          type: "text/html",
          title: "Homepage markdown source",
        },
      ],
      type: [{ href: "text/markdown" }],
    },
  ],
};

export function GET(): Response {
  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
