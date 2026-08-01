/**
 * Post concepts.
 *
 * Each one maps to a format that measures well for book promotion on static
 * feed placements: a headline over the cover, and a review pull quote. Every
 * post carries one call to action and one URL, because a second ask splits
 * the click.
 *
 * Copy is drawn from the site, the press kit, and the BookLife review. Nothing
 * here is invented.
 */

export const CTA = {
  button: "Pre-order the book now",
  url: "midnightcoderschildren.com",
  release: "Out 15 September 2026",
};

export const CONCEPTS = [
  {
    id: "01-architect",
    layout: "cover-hook",
    title: "The architect",
    note: "Opens on the money and lands on the person. The attack is the reason to keep reading, and the engineer who saw it coming is the reason the book is not another Wall Street thriller.",
    headline: "Four trillion dollars are frozen. One engineer saw it coming.",
    hook: "A cyberattack has paralyzed the global economy.",
    sub: "The late Gayathri Ramaswamy wrote the systems that hold the money in place, and she warned them this would happen. Nobody listened. Hers is now the only mind that can stop it.",
  },
  {
    id: "02-praise",
    layout: "quote",
    title: "The review",
    note: "Third-party proof. A verdict from a name a reader can go and check outranks anything the author says about his own book, so the quote takes the top of the frame.",
    kicker: "Readers are already talking about it.",
    quote:
      "A brisk financial thriller buoyed by a powerful emotional throughline.",
    attribution: "BookLife",
    sub: "The Midnight Coder’s Children, a novel by Prashant Sridharan.",
  },
  {
    id: "03-timelines",
    layout: "cover-hook",
    title: "The heist",
    note: "The plot at its most propulsive. What is being stolen, what it costs, and the structure that makes this book different from every other Wall Street thriller.",
    headline: "A high-tech bank heist. The world on the brink of war.",
    hook: "Twenty hours in the present. Fifty years in the past.",
    sub: "Sydney McEnroe has one day to reconstruct the mind of the woman who built the bank’s systems, and thwart a global financial catastrophe.",
  },
  {
    id: "04-cipher",
    layout: "cover-hook",
    title: "The cipher",
    note: "The detail people repeat to each other. A failsafe hidden in a family recipe book, readable only by the children who lived those meals.",
    headline: "The global financial system is under attack.",
    hook: "Gayathri Ramaswamy encoded the only way to save the bank in a book only her children can decode.",
    sub: "A propulsive, emotional thriller",
    /* The closing line gets the site's own text-selection colours, so it reads
       as a sentence somebody stopped and marked. */
    markSub: true,
  },
];
