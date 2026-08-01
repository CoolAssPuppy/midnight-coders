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

  images: {
    // Social posts keep stable filenames across rebuilds, so their URLs carry a
    // content hash to stop the optimizer serving the render it cached before
    // the copy changed. Omitting `search` here is what allows that query
    // string; every other local image is still required to have none.
    localPatterns: [
      { pathname: "/social/**" },
      { pathname: "/**", search: "" },
    ],
  },
};

export default nextConfig;
