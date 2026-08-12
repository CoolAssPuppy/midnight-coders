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
            Beehiiv runs the mailing list. Stripe processes payments. Resend
            delivers order confirmations and download links. Cloudflare R2
            stores and delivers purchased ebook files. PostHog and Google
            Analytics record site analytics, and Google Tag Manager loads those
            and other tags. Meta and OpenAI receive conversion events for the
            advertising that runs on their platforms. Vercel hosts the site,
            runs Vercel Analytics and Speed Insights, and keeps server logs
            that include the email address attached to a completed order.
          </p>
          <p>
            Each of those companies has its own privacy policy, and each acts as
            a processor for the data described above.
          </p>
        </TextSection>

        <TextSection heading="Advertising">
          <p>
            The book is advertised on Meta and through OpenAI. Their pixels run
            on every page, not only for visitors who arrived from an ad, and
            they record page views so that audiences can be built for
            retargeting.
          </p>
          <p>
            When any purchase completes, a conversion event is sent to Meta and
            OpenAI. Your email address is hashed before it is sent. The event
            also carries the IP address and browser user agent recorded at
            checkout, along with any advertising identifiers present in your
            cookies, because those are what let the ad platforms match the
            purchase to a click.
          </p>
          <p>
            PostHog identifies you by your email address once you buy, and links
            that identity to the browsing you did on this site beforehand.
          </p>
          <p>
            No data is sold, and none is shared with data brokers.
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
            Every marketing email has an unsubscribe link, and it works
            immediately. Order confirmations and download links are
            transactional and do not carry one, because they are part of
            something you bought. You
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
