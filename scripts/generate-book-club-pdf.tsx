import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
  renderToFile,
} from "@react-pdf/renderer";
import path from "path";

const MIDNIGHT = "#121212";
const WHITE = "#ffffff";
const GRAY = "#999999";
const LIGHT_GRAY = "#cccccc";
const TEAL = "#4EC9B0";

const styles = StyleSheet.create({
  // Title page
  titlePage: {
    backgroundColor: MIDNIGHT,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  cover: {
    width: 150,
    height: 200,
    marginBottom: 40,
    objectFit: "contain" as const,
  },
  titleText: {
    fontFamily: "Times-Bold",
    fontSize: 28,
    color: WHITE,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: "Times-Roman",
    fontSize: 14,
    color: GRAY,
    textAlign: "center",
    marginBottom: 6,
  },
  authorText: {
    fontFamily: "Times-Roman",
    fontSize: 14,
    color: GRAY,
    textAlign: "center",
    marginTop: 20,
  },
  guideLabel: {
    fontFamily: "Courier",
    fontSize: 9,
    color: TEAL,
    textAlign: "center",
    letterSpacing: 3,
    marginTop: 60,
  },

  // Content pages
  contentPage: {
    backgroundColor: WHITE,
    padding: 50,
    paddingTop: 50,
    paddingBottom: 60,
  },
  sectionTitle: {
    fontFamily: "Courier-Bold",
    fontSize: 9,
    color: GRAY,
    letterSpacing: 2,
    marginBottom: 20,
    textTransform: "uppercase" as const,
  },
  themeTitle: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    color: MIDNIGHT,
    marginBottom: 4,
  },
  themeDescription: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#444444",
    lineHeight: 1.6,
    marginBottom: 14,
  },

  // Two-column questions
  twoColumnRow: {
    flexDirection: "row" as const,
    gap: 24,
  },
  column: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: "Times-Bold",
    fontSize: 9,
    color: MIDNIGHT,
    marginBottom: 5,
    marginTop: 4,
  },
  questionRow: {
    flexDirection: "row" as const,
    marginBottom: 5,
    gap: 3,
  },
  questionNumber: {
    fontFamily: "Courier",
    fontSize: 7,
    color: GRAY,
    width: 14,
    textAlign: "right" as const,
    paddingTop: 0.5,
  },
  questionText: {
    fontFamily: "Times-Roman",
    fontSize: 8,
    color: "#333333",
    lineHeight: 1.5,
    flex: 1,
  },

  // Enhance tips
  tipRow: {
    flexDirection: "row" as const,
    marginBottom: 10,
    gap: 6,
  },
  tipBullet: {
    fontFamily: "Courier",
    fontSize: 8,
    color: GRAY,
    paddingTop: 1,
  },
  tipText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#444444",
    lineHeight: 1.6,
    flex: 1,
  },

  // About author
  aboutText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#444444",
    lineHeight: 1.7,
  },

  // Footer
  pageFooter: {
    position: "absolute" as const,
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  footerText: {
    fontFamily: "Courier",
    fontSize: 7,
    color: LIGHT_GRAY,
  },
});

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

const DISCUSSION_QUESTIONS: Record<string, string[]> = {
  "Characters and relationships": [
    "Sydney keeps a red binder she started on September 11, 2001, when she was in fifth grade. What does the binder reveal about who she is and how she moves through the world? How does childhood shape the way she leads under pressure?",
    "Sydney silences Lina\u2019s calls repeatedly throughout the crisis. What do these small moments tell us about what Sydney sacrifices to be the person she is at work? Is that trade-off voluntary?",
    "Paul grew up in a house smaller than his waiting room and now runs a four-trillion-dollar institution. How does his origin story shape the way he leads, and how does it differ from the way Sydney leads?",
    "Melanie, Carla, and Jimmy each have distinct roles in the crisis response. What does Sydney\u2019s relationship with each of them reveal about how she builds trust? Who does she rely on most, and why?",
    "Gayathri Ramaswamy appears only through other people\u2019s memories and a mysterious database account. How does the novel build a character who is never physically present? What impression did you form of her from these fragments?",
  ],
  "The dual timeline": [
    "The novel alternates between Sydney\u2019s present-day crisis and Gayathri\u2019s past. How did moving between these two timelines affect your experience as a reader? Were there moments when you wanted to stay in one timeline longer?",
    "How does learning about Gayathri\u2019s past change the way you interpret Sydney\u2019s present-day decisions and instincts?",
    "The title refers to \u2018children\u2019 in the plural. Who are the midnight coder\u2019s children, and in what ways does the novel define that relationship beyond biology?",
  ],
  "Technology, ethics, and power": [
    "The cyberattack in the novel targets the infrastructure that holds the financial system together. How did the technical details affect your sense of the stakes? Did the novel change how you think about the systems behind your own bank account?",
    "Sydney orders phones off and the building locked down. Jimmy audits four years of backups. The FBI arrives in minutes. How realistic did these responses feel to you? What surprised you about how institutions respond to this kind of threat?",
    "Gayathri left behind a hidden superuser account -- \u2018Gaya1973\u2019 -- that nobody knew about. Is this an act of foresight, sabotage, or something else entirely? What does it mean that the institution\u2019s salvation might come from an individual acting outside its rules?",
    "Paul says, \u2018I pay you to make sure this doesn\u2019t happen.\u2019 How does the novel portray the tension between the people who build systems and the people who profit from them?",
  ],
  "Immigration, identity, and legacy": [
    "Gayathri is described as \u2018the heart and soul of the bank,\u2019 yet she seems to have been largely forgotten until the crisis. What does the novel suggest about how institutions remember -- and fail to remember -- the people who built them?",
    "How does the novel explore what it means to build something lasting in a country that isn\u2019t the one you were born in? How do Gayathri\u2019s and Sydney\u2019s experiences of belonging differ?",
    "The novel weaves Indian names, cultural details, and immigrant experiences into a Wall Street thriller. How did this combination land for you? Did it expand your sense of what a thriller can be about?",
  ],
  "Your reading experience": [
    "Which scene or moment stayed with you after you finished reading? Why?",
    "If you could ask any character one question, who would it be and what would you ask?",
    "The chapter ends with: \u2018She died years ago.\u2019 How did that final line land for you? What questions did it raise?",
  ],
};

const ENHANCE_TIPS = [
  "Before your meeting, have each member pick either Sydney or Gayathri and read the novel paying special attention to their chosen character. Compare notes at the discussion.",
  "Look up the real Bangladesh Bank heist (2016) and the MGM casino cyberattack (2023), both referenced in the novel. How does the fiction compare to reality?",
  "Discuss the title. Who are the \u2018midnight coder\u2019s children\u2019? The answer may be more layered than it first appears.",
  "Pay attention to the physical objects in the novel: the red binder, the Moleskine notebook, the burner phones, the Yubikeys. What role do analog tools play in a digital crisis?",
  "Consider reading Chapter 1 aloud together. The pacing is built for it -- the short sentences, the rhythm of \u2018but she kept running.\u2019",
];

function PageFooter({ pageNum }: { pageNum: number }): React.ReactElement {
  return (
    <View style={styles.pageFooter} fixed>
      <Text style={styles.footerText}>
        The Midnight Coder&apos;s Children -- Book Club Guide
      </Text>
      <Text style={styles.footerText}>{pageNum}</Text>
    </View>
  );
}

// Split questions into two columns
const categories = Object.entries(DISCUSSION_QUESTIONS);
const leftCategories = categories.slice(0, 3);
const rightCategories = categories.slice(3);

function QuestionColumn({
  items,
}: {
  items: [string, string[]][];
}): React.ReactElement {
  return (
    <View style={styles.column}>
      {items.map(([category, questions]) => (
        <View key={category}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {questions.map((q, i) => (
            <View key={i} style={styles.questionRow}>
              <Text style={styles.questionNumber}>{i + 1}.</Text>
              <Text style={styles.questionText}>{q}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const coverPath = path.resolve(
  process.cwd(),
  "public/images/book-cover/Midnight Coders Children Cover.jpg"
);

const authorPhotoPath = path.resolve(
  process.cwd(),
  "public/images/author/prashant-sridharan.jpg"
);

function BookClubPDF(): React.ReactElement {
  return (
    <Document
      title="Book Club Guide -- The Midnight Coder's Children"
      author="Prashant Sridharan"
      subject="Book Club Discussion Guide"
    >
      {/* Title page */}
      <Page size="LETTER" style={styles.titlePage}>
        <Image src={coverPath} style={styles.cover} />
        <Text style={styles.titleText}>
          The Midnight Coder&apos;s Children
        </Text>
        <Text style={styles.subtitleText}>A Novel</Text>
        <Text style={styles.authorText}>Prashant Sridharan</Text>
        <Text style={styles.guideLabel}>BOOK CLUB GUIDE</Text>
      </Page>

      {/* Themes */}
      <Page size="LETTER" style={styles.contentPage}>
        <Text style={styles.sectionTitle}>Themes to explore</Text>
        {THEMES.map((theme) => (
          <View key={theme.title}>
            <Text style={styles.themeTitle}>{theme.title}</Text>
            <Text style={styles.themeDescription}>{theme.description}</Text>
          </View>
        ))}
        <PageFooter pageNum={2} />
      </Page>

      {/* Discussion questions -- two columns */}
      <Page
        size="LETTER"
        style={{ ...styles.contentPage, padding: 40, paddingTop: 40, paddingBottom: 50 }}
      >
        <Text style={styles.sectionTitle}>Discussion questions</Text>
        <View style={styles.twoColumnRow}>
          <QuestionColumn items={leftCategories} />
          <QuestionColumn items={rightCategories} />
        </View>
        <PageFooter pageNum={3} />
      </Page>

      {/* Enhance your discussion */}
      <Page size="LETTER" style={styles.contentPage}>
        <Text style={styles.sectionTitle}>Enhance your discussion</Text>
        {ENHANCE_TIPS.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Text style={styles.tipBullet}>*</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
        <PageFooter pageNum={4} />
      </Page>

      {/* About the author */}
      <Page size="LETTER" style={styles.contentPage}>
        <Text style={styles.sectionTitle}>About the author</Text>
        <View
          style={{
            flexDirection: "row" as const,
            gap: 24,
            marginTop: 10,
          }}
        >
          <Image
            src={authorPhotoPath}
            style={{
              width: 140,
              height: 187,
              objectFit: "cover" as const,
              borderRadius: 4,
            }}
          />
          <View style={{ flex: 1, justifyContent: "center" as const }}>
            <Text
              style={{
                fontFamily: "Times-Bold",
                fontSize: 18,
                color: MIDNIGHT,
                marginBottom: 6,
              }}
            >
              Prashant Sridharan
            </Text>
            <Text style={styles.aboutText}>
              Prashant Sridharan has held senior marketing roles at Microsoft,
              Meta, Twitter, Timescale, and Supabase. His international
              best-seller Picks and Shovels explores marketing to developers
              during the AI gold rush. The Midnight Coder&apos;s Children is
              his debut novel, drawing on years spent inside the institutions
              and engineering cultures the book portrays. He lives in Lisbon,
              Portugal and San Francisco, California.
            </Text>
            <View style={{ marginTop: 10 }}>
              <Link
                src="https://www.strategicnerds.com"
                style={{
                  fontFamily: "Courier",
                  fontSize: 8,
                  color: LIGHT_GRAY,
                  marginBottom: 3,
                  textDecoration: "none",
                }}
              >
                strategicnerds.com
              </Link>
              <Link
                src="https://midnightcoderschildren.com"
                style={{
                  fontFamily: "Courier",
                  fontSize: 8,
                  color: LIGHT_GRAY,
                  textDecoration: "none",
                }}
              >
                midnightcoderschildren.com
              </Link>
            </View>
          </View>
        </View>

        <PageFooter pageNum={5} />
      </Page>
    </Document>
  );
}

async function main(): Promise<void> {
  const outputPath = path.resolve(
    process.cwd(),
    "public/midnight-coders-children-book-club-guide.pdf"
  );
  await renderToFile(<BookClubPDF />, outputPath);
  console.log(`PDF generated: ${outputPath}`);
}

main().catch(console.error);
