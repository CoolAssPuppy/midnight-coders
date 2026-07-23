import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import { MetaPageView } from "@/components/MetaPageView";
import { PRIMARY_BUY_URL } from "@/lib/buy-links";
import { OPENAI_PIXEL_ID, META_DATASET_ID } from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const GTM_ID = "GTM-W663MCWC";

const baseUrl = SITE_URL;

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
    title: "The Midnight Coder's Children: A Novel by Prashant Sridharan",
    description:
      "It's a race against the clock to save the global financial system. A propulsive, emotionally grounded thriller. Coming September 2026.",
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "The Midnight Coder's Children",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Midnight Coder's Children: A Novel by Prashant Sridharan",
    description:
      "It's a race against the clock to save the global financial system. A propulsive, emotionally grounded thriller. Coming September 2026.",
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
      offers: {
        "@type": "Offer",
        price: "18.99",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder",
        url: PRIMARY_BUY_URL,
      },
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
        {/*
          Ad measurement pixels. Both are afterInteractive rather than
          lazyOnload because a retailer click can happen well before the browser
          goes idle, and a queued-but-unsent conversion is a lost conversion.
          Each renders only when its id is configured, so an unconfigured
          environment ships no dead script.
        */}
        {OPENAI_PIXEL_ID && (
          <>
            <link rel="preconnect" href="https://bzrcdn.openai.com" />
            <Script
              id="oaiq-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.oaiq=window.oaiq||function(){(window.oaiq.q=window.oaiq.q||[]).push(arguments)};
oaiq("init",{pixelId:"${OPENAI_PIXEL_ID}"});`,
              }}
            />
            <Script
              id="oaiq-sdk"
              strategy="afterInteractive"
              src="https://bzrcdn.openai.com/sdk/oaiq.min.js"
            />
          </>
        )}
        {META_DATASET_ID && (
          <>
            <link rel="preconnect" href="https://connect.facebook.net" />
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_DATASET_ID}');`,
              }}
            />
          </>
        )}
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
        {META_DATASET_ID && <MetaPageView />}
        <PostHogProvider>
          <Navigation />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
