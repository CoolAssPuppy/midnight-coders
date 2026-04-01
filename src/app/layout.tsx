import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import "./globals.css";

const GTM_ID = "GTM-W663MCWC";

const baseUrl = "https://midnightcoderschildren.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "The Midnight Coder's Children | Coming September 2026",
  description:
    "A propulsive, emotionally grounded thriller about trust, legacy, and the fragile bonds that hold both families and civilizations together. Coming September 2026.",
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
  authors: [{ name: "Prashant Sridharan", url: "https://www.strategicnerds.com" }],
  creator: "Prashant Sridharan",
  publisher: "Bodhi Press",
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "The Midnight Coder's Children",
    description:
      "When a fast-moving cyberattack spreads across the global financial system, a brilliant systems engineer is pulled into a race against time.",
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "The Midnight Coder's Children",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Midnight Coder's Children",
    description:
      "A propulsive, emotionally grounded thriller. Coming September 2026.",
    site: "@CoolAssPuppy",
    creator: "@CoolAssPuppy",
  },
  robots: {
    index: true,
    follow: true,
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
    },
    {
      "@type": "Person",
      "@id": `${baseUrl}/#author`,
      name: "Prashant Sridharan",
      url: "https://www.strategicnerds.com",
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
        "Developer Marketing",
        "Cybersecurity",
        "Financial Systems",
        "Fiction Writing",
      ],
      description:
        "Prashant Sridharan is the author of The Midnight Coder's Children and the international best-seller Picks and Shovels. He has held senior marketing roles at Microsoft, Meta, Twitter, Timescale, and Supabase.",
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
      bookFormat: "https://schema.org/Hardcover",
      numberOfPages: 400,
      datePublished: "2026-09-22",
      image: `${baseUrl}/opengraph-image`,
      url: baseUrl,
    },
    {
      "@type": "Event",
      "@id": `${baseUrl}/#release`,
      name: "The Midnight Coder's Children - Book Release",
      description: "The release of The Midnight Coder's Children by Prashant Sridharan",
      startDate: "2026-09-22",
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
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:text-sm">Skip to content</a>
        <Navigation />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
