const baseUrl = "https://midnightcoderschildren.com";

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
