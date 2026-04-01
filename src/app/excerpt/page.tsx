import type { Metadata } from "next";
import { ExcerptReader } from "@/components/ExcerptReader";

export const metadata: Metadata = {
  title: "Read Chapter 1 | The Midnight Coder's Children",
  description:
    "Read the opening chapter of The Midnight Coder's Children. Sydney McEnroe arrives at JR Eastman at 5:43 a.m. to discover the worst has happened.",
  openGraph: {
    title: "Read Chapter 1 | The Midnight Coder's Children",
    description:
      "Read Chapter 1 of The Midnight Coder's Children by Prashant Sridharan.",
  },
};

export default function ExcerptPage(): React.ReactElement {
  return (
    <main id="main-content">
      <ExcerptReader />
    </main>
  );
}
