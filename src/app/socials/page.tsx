import type { Metadata } from "next";

import { BuyTheBook } from "@/components/BuyTheBook";
import { SocialPostGallery } from "@/components/SocialPostGallery";
import { SocialsBackground } from "@/components/SocialsBackground";
import { SOCIAL_POSTS } from "@/lib/social-posts.generated";
import { siteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Tell Your Friends | The Midnight Coder's Children",
  description:
    "Ready-to-post images and looping videos for The Midnight Coder's Children, in vertical, story, and square sizes.",
  alternates: { canonical: siteUrl("/socials") },
  openGraph: {
    title: "Tell Your Friends | The Midnight Coder's Children",
    description:
      "Ready-to-post images and looping videos for The Midnight Coder's Children.",
    url: siteUrl("/socials"),
  },
};

const MONO = { fontFamily: "var(--font-mono)" } as const;
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Tell Your Friends", path: "/socials" },
]);

export default function SocialsPage(): React.ReactElement {
  return (
    <>
      <SocialsBackground />
      <main
        id="main-content"
        className="relative z-10 pt-24 pb-20 md:pt-32 md:pb-28 px-6"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ ...MONO, color: "rgba(255, 255, 255, 0.4)" }}
            >
              Social assets
            </p>
            <h1
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ ...SERIF, color: "#fff" }}
            >
              The Midnight Coder&apos;s Children
            </h1>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ ...MONO, color: "rgba(255, 255, 255, 0.5)" }}
            >
              by Prashant Sridharan
            </p>
            <BuyTheBook showShareLink={false} />
          </div>

          <SocialPostGallery posts={SOCIAL_POSTS} />

          <div
            className="mt-24 md:mt-32 pt-4"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
          >
            <BuyTheBook id="buy-footer" showShareLink={false} />
          </div>
        </div>
      </main>
    </>
  );
}
