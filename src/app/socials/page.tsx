import type { Metadata } from "next";

import { SocialPostGallery } from "@/components/SocialPostGallery";
import { SocialsBackground } from "@/components/SocialsBackground";
import { SOCIAL_POSTS } from "@/lib/social-posts.generated";
import { siteUrl } from "@/lib/site";

/**
 * Nothing links here yet, so the page is kept out of search. Remove the robots
 * block when it goes into the navigation.
 */
export const metadata: Metadata = {
  title: "Social Assets | The Midnight Coder's Children",
  description:
    "Ready-to-post images for The Midnight Coder's Children, in vertical, story, and square sizes.",
  alternates: { canonical: siteUrl("/socials") },
  robots: { index: false, follow: false },
};

const MONO = { fontFamily: "var(--font-mono)" } as const;
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

export default function SocialsPage(): React.ReactElement {
  return (
    <>
      <SocialsBackground />
      <main
        id="main-content"
        className="relative z-10 pt-24 pb-20 md:pt-32 md:pb-28 px-6"
      >
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
              className="text-sm leading-relaxed"
              style={{ ...MONO, color: "rgba(255, 255, 255, 0.5)" }}
            >
              by Prashant Sridharan
            </p>
          </div>

          <SocialPostGallery posts={SOCIAL_POSTS} />
        </div>
      </main>
    </>
  );
}
