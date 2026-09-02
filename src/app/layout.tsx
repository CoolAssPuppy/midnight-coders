import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { MarketingScripts } from "@/components/MarketingScripts";
import { PRIMARY_BUY_URL } from "@/lib/buy-links";
import {
  BOOK_AUTHOR,
  BOOK_RELEASE_DATE,
  BOOK_TITLE,
  DIGITAL_PRICE,
  PAPERBACK_PRICE,
} from "@/lib/book-facts";
import { SITE_URL, siteUrl } from "@/lib/site";
import "./globals.css";

const baseUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: `${BOOK_TITLE} by ${BOOK_AUTHOR} | A novel from Bodhi Press`,
  description:
    `${BOOK_TITLE} is a techno-thriller by ${BOOK_AUTHOR}. Paperback on Amazon. Released 15 September 2026 from Bodhi Press.`,
  keywords: [
    "thriller",
    "novel",
    "cyberattack",
    "tech thriller",
    "family",
    "immigrant fiction",
    "financial thriller",
    "cybersecurity thriller",
    "Wall Street thriller",
    "dual timeline novel",
    "Prashant Sridharan",
    "Bodhi Press",
  ],
  authors: [{ name: BOOK_AUTHOR, url: siteUrl("/author") }],
  creator: "Prashant Sridharan",
  publisher: "Bodhi Press",
  alternates: {
    canonical: baseUrl,
    // The site publishes in American English only, so it is its own alternate.
    // Declaring it gives crawlers an explicit language signal rather than one
    // inferred from <html lang>. Pages with their own canonical repeat this.
    languages: {
      "en-US": baseUrl,
      "x-default": baseUrl,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: `${BOOK_TITLE} by ${BOOK_AUTHOR}`,
    description:
      "It's a race against the clock to save the global financial system. A techno-thriller by Prashant Sridharan. Paperback on Amazon. Coming September 2026.",
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: BOOK_TITLE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BOOK_TITLE} by ${BOOK_AUTHOR}`,
    description:
      "It's a race against the clock to save the global financial system. A techno-thriller by Prashant Sridharan. Paperback on Amazon. Coming September 2026.",
    site: "@CoolAssPuppy",
    creator: "@CoolAssPuppy",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    // Proves domain ownership to Meta, which gates Aggregated Event
    // Measurement. Without AEM, conversions from iOS users who opted out of
    // tracking are not attributed at all.
    "facebook-domain-verification": "fgd1cdpu0fxtpp8exhb9zujr3bn6tl",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1628",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Bodhi Press",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.svg`,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "Media Relations",
          email: "book@midnightcoderschildren.com",
          availableLanguage: ["en"],
          areaServed: "Worldwide",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "The Midnight Coder's Children",
      description:
        "A propulsive, emotionally grounded thriller about trust, legacy, and the fragile bonds that hold both families and civilizations together.",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      inLanguage: "en-US",
      // Targets the crawlable synopsis, which is the part of the homepage a
      // voice assistant can usefully read aloud. See CrawlableSynopsis.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#synopsis"],
      },
    },
    {
      "@type": "Person",
      "@id": `${baseUrl}/#author`,
      name: "Prashant Sridharan",
      url: `${baseUrl}/author`,
      sameAs: [
        "https://twitter.com/CoolAssPuppy",
        "https://linkedin.com/in/prashantsridharan",
        "https://instagram.com/CoolAssPuppy",
        "https://tiktok.com/@CoolAssPuppy",
        "https://threads.net/@CoolAssPuppy",
        "https://bsky.app/profile/CoolAssPuppy",
      ],
      jobTitle: "Author",
      knowsAbout: [
        "Technology",
        "Cybersecurity",
        "Financial Systems",
        "Fiction Writing",
      ],
      description:
        "Prashant Sridharan is the author of The Midnight Coder's Children and the international best-seller Picks and Shovels. He has held senior marketing leadership roles at Microsoft, AWS, Meta, Twitter, and Supabase.",
    },
    {
      "@type": "Book",
      "@id": `${baseUrl}/#book`,
      name: "The Midnight Coder's Children",
      author: {
        "@id": `${baseUrl}/#author`,
      },
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      description:
        "A propulsive, emotionally grounded thriller about trust, legacy, and the fragile bonds that hold both families and civilizations together.",
      genre: ["Thriller", "Financial Thriller", "Tech Thriller"],
      inLanguage: "en",
      bookFormat: "https://schema.org/Paperback",
      numberOfPages: 348,
      isbn: "9798999111128",
      datePublished: "2026-09-15",
      // Two editions, two offers. The digital one was missing entirely, which
      // meant the only price an agent could read was the paperback's.
      offers: [
        {
          "@type": "Offer",
          name: "Paperback",
          price: PAPERBACK_PRICE,
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          availabilityStarts: BOOK_RELEASE_DATE,
          url: PRIMARY_BUY_URL,
          seller: { "@id": `${baseUrl}/#organization` },
        },
        {
          "@type": "Offer",
          name: "Digital edition, DRM-free EPUB",
          price: DIGITAL_PRICE,
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          availabilityStarts: BOOK_RELEASE_DATE,
          url: `${baseUrl}/buy`,
          seller: { "@id": `${baseUrl}/#organization` },
        },
      ],
      image: `${baseUrl}/opengraph-image`,
      url: baseUrl,
    },
    {
      "@type": "Event",
      "@id": `${baseUrl}/#release`,
      name: "The Midnight Coder's Children - Book Release",
      description: "The release of The Midnight Coder's Children by Prashant Sridharan",
      startDate: "2026-09-15",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      organizer: {
        "@id": `${baseUrl}/#organization`,
      },
      performer: {
        "@id": `${baseUrl}/#author`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm">Skip to content</a>
        <MarketingScripts />
        <PostHogProvider>
          <Navigation />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </PostHogProvider>
        <ConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
