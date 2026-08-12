import { blurbParagraphs } from "@/lib/book-blurb";
import { BOOK_FACTS } from "@/lib/book-facts";

/**
 * The homepage synopsis as plain, always-present HTML.
 *
 * The visible homepage is a scroll-driven animation whose components return
 * null at scroll position zero, which is the state the server renders. The
 * result was a homepage with 67 words of crawlable text and no synopsis at
 * all. This renders the same prose the animation paints, so search crawlers,
 * AI agents, and screen readers get the book description without having to
 * scroll or run JavaScript.
 *
 * It is visually hidden rather than laid out, because the animation already
 * presents this content to sighted readers. Same words, second presentation.
 */
export function CrawlableSynopsis(): React.ReactElement {
  return (
    <section id="synopsis" className="sr-only">
      <h2>About the book</h2>
      {blurbParagraphs().map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}

      <h2>Book details</h2>
      <dl>
        {BOOK_FACTS.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
