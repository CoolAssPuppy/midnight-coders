/**
 * Press kit content, shared by the page and its markdown representation.
 *
 * Journalists read the page. Agents ask for the same URL with
 * `Accept: text/markdown` and get these same words back. Keeping one copy is
 * what stops the two answers diverging.
 */

export interface Theme {
  title: string;
  description: string;
}

export interface CompTitle {
  title: string;
  author: string;
  connection: string;
}

export interface BookDetail {
  label: string;
  value: string;
  href?: string;
}

export const PRESS_KIT_THEMES: Theme[] = [
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

export const COMP_TITLES: CompTitle[] = [
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

export const BOOK_DETAILS: BookDetail[] = [
  { label: "Author", value: "Prashant Sridharan" },
  { label: "Genre", value: "Upmarket techno-thriller / literary fiction" },
  { label: "Structure", value: "32 chapters, dual timeline" },
  { label: "Word count", value: "~87,000 words" },
  { label: "Publisher", value: "Bodhi Press" },
  { label: "Format", value: "Paperback, 348 pages" },
  { label: "ISBN", value: "979-8999111128" },
  { label: "Price", value: "$18.99" },
  { label: "Release date", value: "September 2026" },
  {
    label: "Press Inquiries",
    value: "press@midnightcoderschildren.com",
    href: "mailto:press@midnightcoderschildren.com",
  },
];
