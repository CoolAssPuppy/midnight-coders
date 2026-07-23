import type { Metadata } from "next";
import Image from "next/image";
import { BuyTheBook } from "@/components/BuyTheBook";
import { AuthorBio } from "@/components/AuthorBio";
import { BIO_JSONLD, BIO_META_LONG, BIO_SHORT } from "@/lib/bio";
import { siteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

export const metadata: Metadata = {
  title: "About Prashant Sridharan | The Midnight Coder's Children",
  description: BIO_META_LONG,
  alternates: {
    canonical: siteUrl("/author"),
  },
  openGraph: {
    title: "About the Author | The Midnight Coder's Children",
    description:
      "Prashant Sridharan -- author, technologist, storyteller.",
    url: siteUrl("/author"),
  },
  twitter: {
    card: "summary_large_image",
    title: "About Prashant Sridharan | The Midnight Coder's Children",
    description: BIO_SHORT,
  },
};


const authorJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    "@id": siteUrl("/#author"),
    name: "Prashant Sridharan",
    jobTitle: "Author",
    url: "https://www.strategicnerds.com",
    image: siteUrl("/images/author/prashant-sridharan.jpg"),
    description: BIO_JSONLD,
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

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Author", path: "/author" },
]);

export default function AuthorPage(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="pt-24 pb-20 md:pt-32 md:pb-28 px-6"
      style={{ backgroundColor: "#0a1628" }}
    >
      {/* Static JSON-LD from hardcoded object -- no user input, safe from XSS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
              Three decades at the intersection of technology and storytelling.
            </p>
          </div>
        </div>

        <AuthorBio variant="full" />

        <BuyTheBook />
      </div>
    </main>
  );
}
