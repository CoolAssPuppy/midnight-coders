import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://midnightcoderschildren.com"),
  title: "The Midnight Coder's Children | Coming September 2026",
  description:
    "A propulsive, emotionally grounded thriller about trust, legacy, and the fragile bonds that hold both families and civilizations together. Coming September 2026.",
  keywords: [
    "thriller",
    "novel",
    "cyberattack",
    "tech",
    "family",
    "immigrant story",
    "financial thriller",
  ],
  authors: [{ name: "Prashant Sridharan" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "The Midnight Coder's Children",
    description:
      "When a fast-moving cyberattack spreads across the global financial system, a brilliant systems engineer is pulled into a race against time.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "The Midnight Coder's Children - A novel by Prashant Sridharan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Midnight Coder's Children",
    description:
      "A propulsive, emotionally grounded thriller. Coming September 2026.",
    images: ["/images/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
