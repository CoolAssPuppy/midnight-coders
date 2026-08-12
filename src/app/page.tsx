import { CrawlableSynopsis } from "@/components/CrawlableSynopsis";
import { HomeExperience } from "@/components/HomeExperience";

/**
 * The homepage is a server component so the synopsis is in the HTML.
 *
 * The scroll animation lives in HomeExperience, which is a client component
 * whose children all render null until the reader scrolls. Keeping the page
 * itself on the server is what lets CrawlableSynopsis ship real text to
 * crawlers and agents.
 */
export default function Home(): React.ReactElement {
  return (
    <main id="main-content" className="relative min-h-[400vh]">
      <h1 className="sr-only">
        The Midnight Coder&apos;s Children: A Novel by Prashant Sridharan
      </h1>

      <CrawlableSynopsis />

      <HomeExperience />
    </main>
  );
}
