import type { Metadata } from "next";
import Link from "next/link";
import { TextPage, TextSection, textLinkStyle } from "@/components/TextPage";
import { siteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

const EMAIL = "book@midnightcoderschildren.com";
const UPDATED = "12 August 2026";
const DESCRIPTION =
  "What midnightcoderschildren.com collects, who processes it, and how to have it deleted.";

export const metadata: Metadata = {
  title: "Privacy | The Midnight Coder's Children",
  description: DESCRIPTION,
  alternates: {
    canonical: siteUrl("/privacy"),
    languages: {
      "en-US": siteUrl("/privacy"),
      "x-default": siteUrl("/privacy"),
    },
  },
  openGraph: {
    title: "Privacy | The Midnight Coder's Children",
    description: DESCRIPTION,
    url: siteUrl("/privacy"),
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Privacy", path: "/privacy" },
]);

export default function PrivacyPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TextPage
        eyebrow="Privacy"
        title="Privacy policy"
        intro={`Last updated ${UPDATED}. This is a book website run by one person. It collects as little as it can and sells nothing to anybody.`}
      >
        <TextSection heading="What gets collected">
          <p>
            If you join the mailing list, the site stores your first name, last
            name, and email address, plus how you arrived at the site and
            whether you asked to be a beta reader.
          </p>
          <p>
            If you buy the digital edition, Stripe collects your payment details
            and a billing address. The billing address is required to work out
            the right sales tax or VAT. Nothing ships, so no shipping address is
            collected unless a physical item is added to the order. Card numbers
            never reach this site&apos;s servers.
          </p>
          <p>
            Every visitor generates analytics events: pages viewed, how far down
            a page you scrolled, which buy links you clicked, and a rough
            location derived from your IP address.
          </p>
        </TextSection>

        <TextSection heading="Who processes it">
          <p>
            Beehiiv runs the mailing list. Stripe processes payments.
            Cloudflare R2 stores and delivers purchased ebook files. hCaptcha
            checks that signup forms are not being submitted by bots. PostHog
            and Google Analytics record site analytics. Meta and OpenAI receive
            conversion events for the advertising that runs on their platforms.
            Vercel hosts the site and keeps standard server logs.
          </p>
          <p>
            Each of those companies has its own privacy policy, and each acts as
            a processor for the data described above.
          </p>
        </TextSection>

        <TextSection heading="Advertising">
          <p>
            The book is advertised on Meta and through OpenAI. When you arrive
            from one of those ads and later buy or subscribe, a conversion event
            is sent back so the advertising can be measured. That event contains
            a hashed version of your email address rather than the address
            itself.
          </p>
          <p>
            No advertising profile is built on this site, and no data is sold or
            shared with data brokers.
          </p>
        </TextSection>

        <TextSection heading="What is never collected">
          <p>
            No card numbers, no passwords, and no accounts, because the site has
            no login. The novel&apos;s excerpt is readable without giving up
            anything at all.
          </p>
        </TextSection>

        <TextSection heading="How long it is kept">
          <p>
            Mailing list records are kept until you unsubscribe, after which
            Beehiiv retains a suppression record so you are not emailed again by
            mistake. Purchase records are kept as long as tax law requires,
            currently seven years. Analytics data is kept for fourteen months.
          </p>
        </TextSection>

        <TextSection heading="Your choices">
          <p>
            Every email has an unsubscribe link, and it works immediately. You
            can ask for a copy of what is held about you, ask for it to be
            corrected, or ask for it to be deleted, by writing to{" "}
            <a href={`mailto:${EMAIL}`} style={textLinkStyle}>
              {EMAIL}
            </a>
            . Deletion requests are honored within thirty days. Purchase records
            required for tax reporting are the one exception.
          </p>
          <p>
            If you are in the European Economic Area or the United Kingdom, the
            legal basis is consent for the mailing list and analytics, and
            contract for anything you buy. You may withdraw consent at any time.
          </p>
        </TextSection>

        <TextSection heading="Children">
          <p>
            This site is not directed at children under 13, and no information
            is knowingly collected from them.
          </p>
        </TextSection>

        <TextSection heading="Changes">
          <p>
            If this policy changes in a way that matters, the date at the top
            changes with it. See also the{" "}
            <Link href="/terms" style={textLinkStyle}>
              terms of use
            </Link>
            .
          </p>
        </TextSection>
      </TextPage>
    </>
  );
}
