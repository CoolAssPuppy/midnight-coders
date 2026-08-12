import type { Metadata } from "next";
import { BuyTheBook } from "@/components/BuyTheBook";
import { MediaAssets } from "@/components/MediaAssets";
import { siteUrl } from "@/lib/site";
import { PRAISE } from "@/lib/praise";
import {
  BOOK_DETAILS,
  COMP_TITLES,
  PRESS_KIT_THEMES,
} from "@/lib/press-kit-content";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Press Kit | The Midnight Coder's Children",
  description:
    "Press kit for The Midnight Coder's Children by Prashant Sridharan. Premise, themes, comparable titles, and book details for a dual-timeline techno-thriller. Coming September 2026.",
  alternates: {
    canonical: siteUrl("/press-kit"),
  },
  openGraph: {
    title: "Press Kit | The Midnight Coder's Children",
    description:
      "A dual-timeline techno-thriller by Prashant Sridharan. Coming September 2026.",
    url: siteUrl("/press-kit"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Press Kit | The Midnight Coder's Children",
    description:
      "Premise, themes, comp titles, and book details. A dual-timeline techno-thriller by Prashant Sridharan.",
  },
};









const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Press Kit", path: "/press-kit" },
]);

export default function AboutBookPage(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="pt-24 pb-20 md:pt-32 md:pb-28 px-6"
      style={{ backgroundColor: "#0a1628" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
            Press kit
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
            className="text-sm leading-relaxed mb-8"
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: "var(--font-mono)",
            }}
          >
            by Prashant Sridharan
          </p>
          <BuyTheBook />
        </div>

        {/* Premise */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            The premise
          </h2>
          <div
            className="space-y-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <p
              className="text-base leading-[1.8]"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              A catastrophic cyberattack hits one of Wall Street&apos;s largest
              banks, freezing four trillion dollars in assets. Sydney McEnroe, the
              VP of Engineering, knows the protocols. She knows who to call and
              what to do. What she has not accounted for: the only path to
              recovery is hidden in a failsafe engineered decades ago by Gayathri
              Ramaswamy, a brilliant database architect who has been dead for
              years.
            </p>
            <p
              className="text-base leading-[1.8]"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Gayathri predicted an attack of this magnitude while building the
              bank&apos;s systems, but no one listened. She encoded the solution
              inside a recipe book cipher that can only be cracked by those who
              lived the moments she recorded. As the attack escalates toward every
              major bank in America, Sydney must track down Gayathri&apos;s
              surviving children and piece together the mind of a woman the
              institution forgot.
            </p>
            <p
              className="text-base leading-[1.8]"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Told across two timelines -- a twenty-hour crisis in the present and
              fifty years of an immigrant life in the past -- the novel braids a
              Wall Street thriller with the story of a woman who built invisible
              systems both technical and emotional, and left behind a message her
              family was never meant to decode.
            </p>
          </div>
        </section>

        {/* Praise */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Praise for The Midnight Coder&apos;s Children
          </h2>
          <div className="space-y-7">
            {PRAISE.map((praise) => (
              <blockquote
                key={praise.source}
                className="pl-4"
                style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.12)" }}
              >
                <p
                  className="text-base leading-[1.8]"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {praise.quote}
                </p>
                <footer
                  className="text-xs tracking-wider uppercase mt-2.5"
                  style={{
                    color: "rgba(255, 255, 255, 0.4)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {praise.source}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Themes */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Themes
          </h2>
          <div className="space-y-6">
            {PRESS_KIT_THEMES.map((theme) => (
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

        {/* Comp titles */}
        <section className="mb-14">
          <h2
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            If you liked
          </h2>
          <div className="space-y-5">
            {COMP_TITLES.map((comp) => (
              <div key={comp.title} className="flex gap-3">
                <span
                  className="text-xs mt-1 flex-shrink-0"
                  style={{
                    color: "rgba(255, 255, 255, 0.2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  *
                </span>
                <div>
                  <p
                    className="text-sm"
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    <em>{comp.title}</em>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      {" "}
                      by {comp.author}
                    </span>
                  </p>
                  <p
                    className="text-sm leading-[1.75] mt-0.5"
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {comp.connection}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Book details */}
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
            Book details
          </h2>
          <dl className="space-y-3">
            {BOOK_DETAILS.map((detail) => (
              <div key={detail.label} className="flex gap-2">
                <dt
                  className="text-sm flex-shrink-0 w-28"
                  style={{
                    color: "rgba(255, 255, 255, 0.4)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {detail.label}
                </dt>
                <dd
                  className="text-sm"
                  style={{
                    color: "rgba(255, 255, 255, 0.75)",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="underline underline-offset-2 transition-opacity hover:opacity-70"
                      style={{ color: "rgba(255, 255, 255, 0.75)" }}
                    >
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Media assets */}
        <MediaAssets />
      </div>
    </main>
  );
}
