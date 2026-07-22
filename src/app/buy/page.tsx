import type { Metadata } from "next";
import Link from "next/link";
import { DigitalEditionCheckout } from "@/components/DigitalEditionCheckout";
import { BUY_LINKS } from "@/lib/buy-links";

const title = "Buy the digital edition";
const description =
  "Buy The Midnight Coder's Children digital edition direct from the author for $14.99. Pre-order now, download on release day, 22 September 2026.";

export const metadata: Metadata = {
  title: `${title} | The Midnight Coder's Children`,
  description,
  alternates: { canonical: "https://midnightcoderschildren.com/buy" },
  openGraph: {
    title,
    description,
    url: "https://midnightcoderschildren.com/buy",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const included = [
  "EPUB, readable on Kindle, Kobo, Apple Books, and anything else",
  "No DRM, so it is yours to keep and move between devices",
  "Buying direct sends the full margin to the author rather than a retailer",
];

export default function BuyPage(): React.ReactElement {
  const retailers = BUY_LINKS.filter((link) => link.href !== null);

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center px-6 py-20"
      style={{ backgroundColor: "#0a1628" }}
    >
      <div className="max-w-2xl w-full flex flex-col items-center text-center">
        <pre
          className="text-left text-sm mb-10 p-4 rounded-lg w-full overflow-x-auto"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <code>
            <span style={{ color: "#c586c0" }}>const</span>{" "}
            <span style={{ color: "#4ec9b0" }}>edition</span>{" "}
            <span style={{ color: "#d4d4d4" }}>=</span>{" "}
            <span style={{ color: "#ce9178" }}>&quot;digital&quot;</span>
            <span style={{ color: "#d4d4d4" }}>;</span>
            {"\n"}
            <span style={{ color: "#c586c0" }}>const</span>{" "}
            <span style={{ color: "#4ec9b0" }}>price</span>{" "}
            <span style={{ color: "#d4d4d4" }}>=</span>{" "}
            <span style={{ color: "#b5cea8" }}>14.99</span>
            <span style={{ color: "#d4d4d4" }}>;</span>
            {"\n"}
            <span style={{ color: "#6A9955" }}>
              {"// ships 2026-09-22"}
            </span>
          </code>
        </pre>

        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#4EC9B0", fontFamily: "var(--font-mono)" }}
        >
          Buy direct from the author
        </h1>

        <p className="text-lg mb-2" style={{ color: "#d4d4d4" }}>
          The digital edition, $14.99, anywhere in the world.
        </p>

        <p className="text-sm mb-10" style={{ color: "#6A9955" }}>
          {"// This is a pre-order. Your download link arrives by email now and unlocks on release day."}
        </p>

        <DigitalEditionCheckout />

        <ul className="mt-12 mb-12 text-left space-y-3 w-full max-w-md">
          {included.map((item) => (
            <li
              key={item}
              className="text-sm flex gap-3"
              style={{ color: "#d4d4d4" }}
            >
              <span style={{ color: "#4EC9B0" }} aria-hidden="true">
                +
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div
          className="w-full pt-10"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <p className="text-sm mb-5" style={{ color: "#6A9955" }}>
            {"// Prefer paperback, or prefer a retailer?"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {retailers.map((link) => (
              <Link
                key={link.label}
                href={link.href as string}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  color: "#9CDCFE",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
