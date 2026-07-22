import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog's own domain is on most ad-blocker lists, so analytics is proxied
  // through this origin. The /static rule must come first or asset requests
  // fall through to the ingest host and 404.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  // PostHog requires this alongside the rewrites above; without it a trailing
  // slash redirect breaks ingest requests.
  skipTrailingSlashRedirect: true,

  // The ebook lives outside public/ and is only ever read by the download
  // route, so Next has no way to infer that it must ship with the deployment.
  outputFileTracingIncludes: {
    "/api/download/[token]": ["./private/ebook/**"],
  },
};

export default nextConfig;
