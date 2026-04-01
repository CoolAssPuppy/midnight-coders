import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Kit | The Midnight Coder's Children",
  description:
    "A propulsive, emotionally grounded techno-thriller about the legacies we make, the trust that holds families and civilizations together, and the systems built by overlooked people.",
  openGraph: {
    title: "Press Kit | The Midnight Coder's Children",
    description:
      "A dual-timeline techno-thriller by Prashant Sridharan. Coming September 2026.",
  },
};

const THEMES = [
  {
    title: "Silence as inheritance",
    description:
      "The Tamil phrase Mounam Sammatham -- silence is consent -- recurs across generations. The novel argues that silence compounds across families and has measurable consequences.",
  },
  {
    title: "Systems as love",
    description:
      "Gayathri builds security systems because she cannot articulate emotional connection. Her failsafe is simultaneously an engineering achievement and an encrypted love letter.",
  },
  {
    title: "The isolation of competence",
    description:
      "Both Gayathri and Sydney are women whose excellence isolates them. They are the smartest people in rooms that do not want them there, leading them to prepare harder, work longer, and trust fewer people.",
  },
  {
    title: "Invisible labor",
    description:
      "The \"midnight coders\" -- immigrant engineers who built the bank's infrastructure and were never recognized -- embody the novel's argument about whose work is valued and whose is erased.",
  },
  {
    title: "Legacy across generations",
    description:
      "A hidden database account connects a dead woman to a living crisis. The novel explores how the work of one generation shapes the next through code, through institutions, through the things we leave behind without knowing we left them.",
  },
  {
    title: "Memory as a category of knowledge",
    description:
      "The cipher does not ask Gayathri's children to process grief or confront failure. It asks them to remember. The novel treats memory and healing as fundamentally different acts.",
  },
];

const COMP_TITLES = [
  {
    title: "Pachinko",
    author: "Min Jin Lee",
    connection: "Multigenerational immigrant saga with commercial appeal",
  },
  {
    title: "Everything I Never Told You",
    author: "Celeste Ng",
    connection: "Family secrets, cultural assimilation, maternal silence",
  },
  {
    title: "The Sympathizer",
    author: "Viet Thanh Nguyen",
    connection: "Literary-genre hybrid, immigrant experience, institutional critique",
  },
  {
    title: "Cutting for Stone",
    author: "Abraham Verghese",
    connection: "Immigrant professional, technical knowledge as narrative engine",
  },
  {
    title: "Daemon",
    author: "Daniel Suarez",
    connection: "Techno-thriller with genuine technical credibility",
  },
  {
    title: "The History of Love",
    author: "Nicole Krauss",
    connection: "Dual-timeline structure, hidden cipher, emotional archaeology",
  },
];

const BOOK_DETAILS = [
  { label: "Author", value: "Prashant Sridharan" },
  { label: "Genre", value: "Upmarket techno-thriller / literary fiction" },
  { label: "Structure", value: "32 chapters, dual timeline" },
  { label: "Word count", value: "~87,000 words" },
  { label: "Publisher", value: "Bodhi Press" },
  { label: "Release date", value: "September 2026" },
];

function BuyLinks(): React.ReactElement {
  const links = [
    { label: "Buy on Amazon", href: "#" },
    { label: "Buy on Barnes & Noble", href: "#" },
    { label: "Buy Direct from Author", href: "#" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {links.map((link) => (
        <span
          key={link.label}
          className="flex flex-col items-center"
        >
          <span
            className="px-6 py-3 text-xs tracking-wider uppercase rounded cursor-default text-center"
            style={{
              color: "rgba(255, 255, 255, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            }}
          >
            {link.label}
          </span>
          <span
            className="text-[9px] tracking-widest uppercase mt-1.5"
            style={{ color: "rgba(255, 255, 255, 0.15)" }}
          >
            Coming soon
          </span>
        </span>
      ))}
    </div>
  );
}

export default function AboutBookPage(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="min-h-screen pt-24 pb-20 md:pt-32 md:pb-28 px-6"
      style={{ backgroundColor: "#0a1628" }}
    >
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
          <BuyLinks />
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
            {THEMES.map((theme) => (
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
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Bottom buy links */}
        <section
          className="pt-8 flex flex-col items-center"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <p
            className="text-xs tracking-[0.15em] uppercase mb-5"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Get the book
          </p>
          <BuyLinks />
        </section>
      </div>
    </main>
  );
}
