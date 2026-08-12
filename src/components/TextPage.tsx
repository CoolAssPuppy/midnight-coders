const MONO = "var(--font-mono)";
const SERIF = "Georgia, 'Times New Roman', serif";

interface TextPageProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}

/**
 * The shell shared by the site's plain text pages.
 *
 * Contact, privacy, terms, and the developer page all wanted the same header
 * treatment the book club and press kit pages use. This keeps the four of them
 * from drifting into four slightly different versions of one design.
 */
export function TextPage({
  eyebrow,
  title,
  intro,
  children,
}: TextPageProps): React.ReactElement {
  return (
    <main
      id="main-content"
      className="pt-24 pb-20 md:pt-32 md:pb-28 px-6"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-14">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: MONO }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: "#fff", fontFamily: SERIF }}
          >
            {title}
          </h1>
          {intro && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255, 255, 255, 0.5)", fontFamily: MONO }}
            >
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
    </main>
  );
}

interface TextSectionProps {
  heading: string;
  id?: string;
  children: React.ReactNode;
}

export function TextSection({
  heading,
  id,
  children,
}: TextSectionProps): React.ReactElement {
  return (
    <section id={id} className="mb-14">
      <h2
        className="text-xs tracking-[0.15em] uppercase mb-5"
        style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: MONO }}
      >
        {heading}
      </h2>
      <div
        className="space-y-4 text-sm leading-[1.75]"
        style={{ color: "rgba(255, 255, 255, 0.75)", fontFamily: MONO }}
      >
        {children}
      </div>
    </section>
  );
}

export const textLinkStyle = {
  color: "rgba(255, 255, 255, 0.9)",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
} as const;
