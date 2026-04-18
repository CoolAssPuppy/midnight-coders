import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beta Reader Feedback | The Midnight Coder's Children",
  description:
    "Beta reader feedback form for The Midnight Coder's Children by Prashant Sridharan. Share your thoughts on characters, timelines, and overall impressions.",
  alternates: {
    canonical: "https://midnightcoderschildren.com/beta",
  },
  openGraph: {
    title: "Beta Reader Feedback | The Midnight Coder's Children",
    description:
      "Beta reader feedback form for The Midnight Coder's Children by Prashant Sridharan.",
    url: "https://midnightcoderschildren.com/beta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beta Reader Feedback | The Midnight Coder's Children",
    description:
      "Share your thoughts on The Midnight Coder's Children as a beta reader.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function BetaLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
