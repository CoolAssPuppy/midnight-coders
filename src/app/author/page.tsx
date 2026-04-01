import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Prashant Sridharan | The Midnight Coder's Children",
  description:
    "Prashant Sridharan has spent two decades at the intersection of technology and storytelling. Author of the best-seller Picks and Shovels. The Midnight Coder's Children is his debut novel.",
  alternates: {
    canonical: "https://midnightcoderschildren.com/author",
  },
  openGraph: {
    title: "About the Author | The Midnight Coder's Children",
    description:
      "Prashant Sridharan -- author, technologist, storyteller.",
    url: "https://midnightcoderschildren.com/author",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Prashant Sridharan | The Midnight Coder's Children",
    description:
      "Author of Picks and Shovels. Senior roles at Microsoft, Meta, Twitter, Supabase.",
  },
};


const authorJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    "@id": "https://midnightcoderschildren.com/#author",
    name: "Prashant Sridharan",
    jobTitle: "Author",
    url: "https://www.strategicnerds.com",
    image: "https://midnightcoderschildren.com/images/author/prashant-sridharan.jpg",
    description:
      "Prashant Sridharan is the author of The Midnight Coder's Children and the international best-seller Picks and Shovels: Marketing to Developers During the AI Gold Rush. He has held senior marketing roles at Microsoft, Meta, Twitter, Timescale, and Supabase.",
    sameAs: [
      "https://twitter.com/CoolAssPuppy",
      "https://linkedin.com/in/prashantsridharan",
      "https://instagram.com/CoolAssPuppy",
      "https://tiktok.com/@CoolAssPuppy",
      "https://threads.net/@CoolAssPuppy",
      "https://bsky.app/profile/CoolAssPuppy",
    ],
    knowsAbout: [
      "Technology",
      "Developer Marketing",
      "Cybersecurity",
      "Financial Systems",
      "Fiction Writing",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Bodhi Press",
    },
  },
};

export default function AuthorPage(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="min-h-screen pt-24 pb-20 md:pt-32 md:pb-28 px-6"
      style={{ backgroundColor: "#0a1628" }}
    >
      {/* Static JSON-LD from hardcoded object -- no user input, safe from XSS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />
      <div className="max-w-2xl mx-auto">
        {/* Photo + name */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <Image
            src="/images/author/prashant-sridharan.jpg"
            alt="Prashant Sridharan"
            width={200}
            height={267}
            priority
            sizes="(max-width: 768px) 160px, 200px"
            className="w-[160px] md:w-[200px] h-auto rounded-lg object-cover"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          />
          <div className="text-center md:text-left">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-2"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              About the author
            </p>
            <h1
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{
                color: "#fff",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Prashant Sridharan
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              Two decades at the intersection of technology and storytelling.
            </p>
          </div>
        </div>

        {/* Bio */}
        <div
          className="space-y-5 mb-12"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          <p
            className="text-base leading-[1.8]"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            Prashant Sridharan has spent two decades at the intersection of
            technology and storytelling. He has held senior marketing roles at Microsoft,
            Meta, Twitter, Timescale, and Supabase.
          </p>
          <p
            className="text-base leading-[1.8]"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            He is the author of the international best-seller{" "}
            <em>
              Picks and Shovels: Marketing to Developers During the AI Gold
              Rush
            </em>
            . <em>The Midnight Coder&apos;s Children</em> is his debut novel.
          </p>
          <p
            className="text-base leading-[1.8]"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            He lives in Lisbon, Portugal and San Francisco, California.
          </p>
        </div>

      </div>
    </main>
  );
}
