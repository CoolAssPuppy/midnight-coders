import type { Metadata } from "next";
import { BuyTheBook } from "@/components/BuyTheBook";

export const metadata: Metadata = {
  title: "Book Club Guide | The Midnight Coder's Children",
  description:
    "Discussion questions, themes, and resources for your book club reading of The Midnight Coder's Children by Prashant Sridharan.",
  alternates: {
    canonical: "https://midnightcoderschildren.com/book-club",
  },
  openGraph: {
    title: "Book Club Guide | The Midnight Coder's Children",
    description:
      "Everything your book club needs to discuss The Midnight Coder's Children.",
    url: "https://midnightcoderschildren.com/book-club",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Club Guide | The Midnight Coder's Children",
    description:
      "Discussion questions, themes, and downloadable PDF guide for your book club.",
  },
};

const DISCUSSION_QUESTIONS = {
  "Characters and relationships": [
    "Sydney keeps a red binder she started on September 11, 2001, when she was in fifth grade. What does the binder reveal about who she is and how she moves through the world? How does childhood shape the way she leads under pressure?",
    "Sydney silences Lina's calls repeatedly throughout the crisis. What do these small moments tell us about what Sydney sacrifices to be the person she is at work? Is that trade-off voluntary?",
    "Paul grew up in a house smaller than his waiting room and now runs a four-trillion-dollar institution. How does his origin story shape the way he leads, and how does it differ from the way Sydney leads?",
    "Melanie, Carla, and Jimmy each have distinct roles in the crisis response. What does Sydney's relationship with each of them reveal about how she builds trust? Who does she rely on most, and why?",
    "Gayathri Ramaswamy appears only through other people's memories and a mysterious database account. How does the novel build a character who is never physically present? What impression did you form of her from these fragments?",
  ],
  "The dual timeline": [
    "The novel alternates between Sydney's present-day crisis and Gayathri's past. How did moving between these two timelines affect your experience as a reader? Were there moments when you wanted to stay in one timeline longer?",
    "How does learning about Gayathri's past change the way you interpret Sydney's present-day decisions and instincts?",
    "The title refers to 'children' in the plural. Who are the midnight coder's children, and in what ways does the novel define that relationship beyond biology?",
  ],
  "Technology, ethics, and power": [
    "The cyberattack in the novel targets the infrastructure that holds the financial system together. How did the technical details affect your sense of the stakes? Did the novel change how you think about the systems behind your own bank account?",
    "Sydney orders phones off and the building locked down. Jimmy audits four years of backups. The FBI arrives in minutes. How realistic did these responses feel to you? What surprised you about how institutions respond to this kind of threat?",
    "Gayathri left behind a hidden superuser account -- 'Gaya1973' -- that nobody knew about. Is this an act of foresight, sabotage, or something else entirely? What does it mean that the institution's salvation might come from an individual acting outside its rules?",
    "Paul says, 'I pay you to make sure this doesn't happen.' How does the novel portray the tension between the people who build systems and the people who profit from them?",
  ],
  "Immigration, identity, and legacy": [
    "Gayathri is described as 'the heart and soul of the bank,' yet she seems to have been largely forgotten until the crisis. What does the novel suggest about how institutions remember -- and fail to remember -- the people who built them?",
    "How does the novel explore what it means to build something lasting in a country that isn't the one you were born in? How do Gayathri's and Sydney's experiences of belonging differ?",
    "The novel weaves Indian names, cultural details, and immigrant experiences into a Wall Street thriller. How did this combination land for you? Did it expand your sense of what a thriller can be about?",
  ],
  "Your reading experience": [
    "Which scene or moment stayed with you after you finished reading? Why?",
    "If you could ask any character one question, who would it be and what would you ask?",
    "The chapter ends with: 'She died years ago.' How did that final line land for you? What questions did it raise?",
  ],
};

const THEMES = [
  {
    title: "Trust",
    description:
      "Trust runs through every layer of the novel. Trust in the systems that hold our money. Trust between colleagues under fire. Trust between generations who never met. The cyberattack shatters institutional trust in minutes, but the deeper question is whether the human bonds -- between Sydney and her team, between Gayathri and the institution she built -- can hold when everything else fails.",
  },
  {
    title: "Preparedness and control",
    description:
      "Sydney's red binder, Melanie's Moleskine, the Trident protocol. The novel is full of people who plan obsessively for catastrophe. It asks whether that preparedness is strength, compulsion, or both -- and what happens when the plan itself isn't enough.",
  },
  {
    title: "Institutional memory",
    description:
      "Gayathri built systems that still run the bank years after her death, yet most employees know her only from an orientation video. The novel examines how organizations forget their builders and what gets lost in that forgetting.",
  },
  {
    title: "The cost of competence",
    description:
      "Sydney is brilliant, decisive, and always on. She is also missing Lina's calls and running on adrenaline at 5:43 a.m. The novel asks what it costs to be the person everyone depends on, and who pays that cost.",
  },
  {
    title: "Legacy across generations",
    description:
      "A hidden database account connects a dead woman to a living crisis. The novel explores how the work of one generation shapes the next -- through code, through institutions, through the things we leave behind without knowing we left them.",
  },
  {
    title: "Diaspora and belonging",
    description:
      "The novel sits at the intersection of immigrant experience and corporate power. It asks who gets to build the systems that run the world, who gets credit for building them, and what happens when those builders are erased from the story.",
  },
];

const ENHANCE_TIPS = [
  "Before your meeting, have each member pick either Sydney or Gayathri and read the novel paying special attention to their chosen character. Compare notes at the discussion.",
  "Look up the real Bangladesh Bank heist (2016) and the MGM casino cyberattack (2023), both referenced in the novel. How does the fiction compare to reality?",
  "Discuss the title. Who are the 'midnight coder's children'? The answer may be more layered than it first appears.",
  "Pay attention to the physical objects in the novel: the red binder, the Moleskine notebook, the burner phones, the Yubikeys. What role do analog tools play in a digital crisis?",
  "Consider reading Chapter 1 aloud together. The pacing is built for it -- the short sentences, the rhythm of 'but she kept running.'",
];

export default function BookClubGuidePage(): React.ReactElement {
  return (
    <main
      id="main-content"
      className="pt-24 pb-20 md:pt-32 md:pb-28 px-6"
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
          <a
            href="/midnight-coders-children-book-club-guide.pdf"
            download
            className="inline-block mt-6 text-[10px] tracking-wider uppercase px-4 py-2 rounded transition-opacity hover:opacity-80"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Download as PDF
          </a>
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
          <p
            className="text-sm leading-[1.75]"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Prashant Sridharan has held senior marketing roles at Microsoft, Meta, Twitter,
            Timescale, and Supabase. His
            international best-seller <em>Picks and Shovels</em> explores marketing to
            developers during the AI gold rush. <em>The Midnight Coder&apos;s
            Children</em> is his debut novel, drawing on years spent inside the
            institutions and engineering cultures the book portrays. He lives in
            San Francisco.
          </p>
        </section>


      </div>
    </main>
  );
}
