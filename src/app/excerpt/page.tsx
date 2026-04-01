import type { Metadata } from "next";
import { ExcerptReader } from "@/components/ExcerptReader";

export const metadata: Metadata = {
  title: "Read Chapter 1 | The Midnight Coder's Children",
  description:
    "Read the opening chapter of The Midnight Coder's Children. Sydney McEnroe arrives at JR Eastman at 5:43 a.m. to discover the worst has happened.",
  alternates: {
    canonical: "https://midnightcoderschildren.com/excerpt",
  },
  openGraph: {
    title: "Read Chapter 1 | The Midnight Coder's Children",
    description:
      "Read Chapter 1 of The Midnight Coder's Children by Prashant Sridharan.",
    url: "https://midnightcoderschildren.com/excerpt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Read Chapter 1 | The Midnight Coder's Children",
    description:
      "Read the opening chapter. Sydney McEnroe arrives at JR Eastman at 5:43 a.m.",
  },
};

export default function ExcerptPage(): React.ReactElement {
  return (
    <main id="main-content">
      <ExcerptReader />
    </main>
  );
}
