import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | The Midnight Coder's Children",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound(): React.ReactElement {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="max-w-md">
        <pre
          className="text-left text-sm mb-8 p-4 rounded-lg"
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            fontFamily: "monospace",
          }}
        >
          <code>
            <span style={{ color: "#c586c0" }}>const</span>{" "}
            <span style={{ color: "#4ec9b0" }}>error</span>{" "}
            <span style={{ color: "#d4d4d4" }}>=</span>{" "}
            <span style={{ color: "#b5cea8" }}>404</span>
            <span style={{ color: "#d4d4d4" }}>;</span>
            {"\n"}
            <span style={{ color: "#c586c0" }}>const</span>{" "}
            <span style={{ color: "#4ec9b0" }}>message</span>{" "}
            <span style={{ color: "#d4d4d4" }}>=</span>{" "}
            <span style={{ color: "#ce9178" }}>&quot;Page not found&quot;</span>
            <span style={{ color: "#d4d4d4" }}>;</span>
          </code>
        </pre>

        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "#fcde09", fontFamily: "monospace" }}
        >
          404
        </h1>

        <p className="text-lg mb-8" style={{ color: "#d4d4d4" }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: "#fcde09",
            color: "#121212",
            fontFamily: "monospace",
          }}
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
