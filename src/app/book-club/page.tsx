import type { Metadata } from "next";
import { DownloadLink } from "@/components/DownloadLink";
import { BuyTheBook } from "@/components/BuyTheBook";
import { AuthorBio } from "@/components/AuthorBio";
import { siteUrl } from "@/lib/site";
import {
  BOOK_CLUB_THEMES,
  DISCUSSION_QUESTIONS,
  ENHANCE_TIPS,
} from "@/lib/book-club-content";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Book Club Guide | The Midnight Coder's Children",
  description:
    "Discussion questions, themes, and resources for your book club reading of The Midnight Coder's Children by Prashant Sridharan.",
  alternates: {
    canonical: siteUrl("/book-club"),
  },
  openGraph: {
    title: "Book Club Guide | The Midnight Coder's Children",
    description:
      "Everything your book club needs to discuss The Midnight Coder's Children.",
    url: siteUrl("/book-club"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Club Guide | The Midnight Coder's Children",
    description:
      "Discussion questions, themes, and downloadable PDF guide for your book club.",
  },
};





const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Book Club Guide", path: "/book-club" },
]);



export default function BookClubGuidePage(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="pt-24 pb-20 md:pt-32 md:pb-28 px-6"
      style={{ backgroundColor: "#0a1628" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Book club guide
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{
              color: "#fff",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            The Midnight Coder&apos;s Children
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: "var(--font-mono)",
            }}
          >
            by Prashant Sridharan
          </p>
          <DownloadLink
            href="/midnight-coders-children-book-club-guide.pdf"
            asset="book-club-guide.pdf"
            category="book_club"
            className="inline-block mt-6 text-[10px] tracking-wider uppercase px-4 py-2 rounded transition-opacity hover:opacity-80"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Download as PDF
          </DownloadLink>
        </div>

        {/* Synopsis */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            About the book
          </h2>
          <div
            className="space-y-4"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            <p
              className="text-base leading-[1.8]"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              When a sophisticated cyberattack takes down one of Wall Street&apos;s
              largest banks, VP of Engineering Sydney McEnroe races against time to
              restore the system, protect four trillion dollars in assets, and find
              the attackers. But as her team digs deeper, they uncover a hidden
              database account belonging to Gayathri Ramaswamy -- a brilliant
              engineer who built the bank&apos;s core systems decades ago and has
              been dead for years.
            </p>
            <p
              className="text-base leading-[1.8]"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Told across two timelines, <em>The Midnight Coder&apos;s Children</em>{" "}
              is a thriller about the people who build the systems we trust with
              everything, the institutions that forget them, and the legacies they
              leave behind in the code itself.
            </p>
          </div>
        </section>

        <BuyTheBook />

        {/* Themes */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Themes to explore
          </h2>
          <div className="space-y-6">
            {BOOK_CLUB_THEMES.map((theme) => (
              <div key={theme.title}>
                <h3
                  className="text-sm font-bold mb-1.5"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {theme.title}
                </h3>
                <p
                  className="text-sm leading-[1.75]"
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Discussion questions */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Discussion questions
          </h2>
          <div className="space-y-10">
            {Object.entries(DISCUSSION_QUESTIONS).map(
              ([category, questions]) => (
                <div key={category}>
                  <h3
                    className="text-sm font-bold mb-4"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {category}
                  </h3>
                  <ol className="space-y-4 list-none m-0 p-0 counter-reset-[question]">
                    {questions.map((question, index) => (
                      <li
                        key={index}
                        className="flex gap-3"
                      >
                        <span
                          className="text-xs mt-1 flex-shrink-0 w-5 text-right"
                          style={{
                            color: "rgba(255, 255, 255, 0.25)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {index + 1}.
                        </span>
                        <p
                          className="text-sm leading-[1.75]"
                          style={{
                            color: "rgba(255, 255, 255, 0.75)",
                            fontFamily: "Georgia, 'Times New Roman', serif",
                          }}
                        >
                          {question}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )
            )}
          </div>
        </section>

        {/* Enhance your discussion */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Enhance your discussion
          </h2>
          <ul className="space-y-4 list-none m-0 p-0">
            {ENHANCE_TIPS.map((tip, index) => (
              <li key={index} className="flex gap-3">
                <span
                  className="text-xs mt-0.5 flex-shrink-0"
                  style={{
                    color: "rgba(255, 255, 255, 0.2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  *
                </span>
                <p
                  className="text-sm leading-[1.75]"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* About the author */}
        <section
          className="mb-14 pt-8"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            About the author
          </h2>
          <AuthorBio variant="compact" />
        </section>


      </div>
    </main>
  );
}
