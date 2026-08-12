import type { Metadata } from "next";
import Link from "next/link";
import { TextPage, TextSection, textLinkStyle } from "@/components/TextPage";
import { siteUrl } from "@/lib/site";
import { BOOK_AUTHOR, BOOK_PUBLISHER, BOOK_TITLE } from "@/lib/book-facts";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

const EMAIL = "book@midnightcoderschildren.com";
const UPDATED = "12 August 2026";
const DESCRIPTION =
  "Terms of use for midnightcoderschildren.com, including copyright, quotation, AI training, and digital purchases.";

export const metadata: Metadata = {
  title: "Terms | The Midnight Coder's Children",
  description: DESCRIPTION,
  alternates: {
    canonical: siteUrl("/terms"),
    languages: {
      "en-US": siteUrl("/terms"),
      "x-default": siteUrl("/terms"),
    },
  },
  openGraph: {
    title: "Terms | The Midnight Coder's Children",
    description: DESCRIPTION,
    url: siteUrl("/terms"),
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Terms", path: "/terms" },
]);

export default function TermsPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TextPage
        eyebrow="Terms"
        title="Terms of use"
        intro={`Last updated ${UPDATED}. Using this site means agreeing to what follows.`}
      >
        <TextSection heading="Copyright">
          <p>
            {BOOK_TITLE} and every part of it, including the sample chapter
            published on this site, is copyright {BOOK_AUTHOR} and published by{" "}
            {BOOK_PUBLISHER}. The cover art, author photography, and the text of
            this website are covered by the same copyright.
          </p>
        </TextSection>

        <TextSection heading="Quotation and reuse" id="reuse">
          <p>
            Quote short passages with attribution and a link back. Reviewers,
            booksellers, journalists, and book clubs need no further permission
            for that, and the{" "}
            <Link href="/press-kit" style={textLinkStyle}>
              press kit
            </Link>{" "}
            exists to make it easy.
          </p>
          <p>
            Reproducing the sample chapter in full, or any substantial part of
            the novel, requires written permission. So does republishing it
            behind a paywall, on a content farm, or in a compilation.
          </p>
          <p>
            The book club guide may be printed and photocopied freely for use by
            an actual book club.
          </p>
        </TextSection>

        <TextSection heading="AI training and retrieval" id="ai">
          <p>
            This site permits AI systems to read it, answer questions about the
            book, and cite it with attribution. That is what the{" "}
            <Link href="/robots.txt" style={textLinkStyle}>
              robots.txt
            </Link>{" "}
            Content-Signal directive <code>search=yes, ai-input=yes</code>{" "}
            declares, and retrieval crawlers are allowed accordingly.
          </p>
          <p>
            This site does not permit its contents to be used to train or
            fine-tune machine learning models. The directive{" "}
            <code>ai-train=no</code> is an express reservation of rights,
            including for the purposes of Article 4 of EU Directive 2019/790.
            Crawlers whose stated purpose is collecting training corpora are
            blocked, and evading those controls does not create permission.
          </p>
          <p>
            Reproducing the novel&apos;s prose as model output is not covered by
            any permission on this page.
          </p>
        </TextSection>

        <TextSection heading="Digital purchases">
          <p>
            The digital edition is a DRM-free EPUB, licensed to you for personal
            use. You may read it on any device you own and keep a backup. You
            may not redistribute it, upload it, or resell it.
          </p>
          <p>
            Pre-orders are charged at the time of purchase and delivered on
            release day by a download link sent to the email address used at
            checkout. That link expires; a fresh one is available by writing to{" "}
            <a href={`mailto:${EMAIL}`} style={textLinkStyle}>
              {EMAIL}
            </a>
            .
          </p>
          <p>
            A pre-order can be refunded in full at any point before delivery.
            After delivery, refunds are at the author&apos;s discretion, because
            the file cannot be returned. Ask and it will be considered.
          </p>
        </TextSection>

        <TextSection heading="The mailing list">
          <p>
            Joining the list means agreeing to receive email about the book.
            Every message carries an unsubscribe link. What the list stores is
            described in the{" "}
            <Link href="/privacy" style={textLinkStyle}>
              privacy policy
            </Link>
            .
          </p>
        </TextSection>

        <TextSection heading="This site">
          <p>
            The site is provided as it is. It is a novel&apos;s website, not a
            service anybody depends on, and no guarantee is made that it will
            always be reachable. Nothing here is professional advice of any
            kind, and the book is fiction: any resemblance to real institutions
            or people is invented.
          </p>
          <p>
            Do not attempt to interfere with the site&apos;s operation, and do
            not use automated tools to scrape it for commercial republication.
          </p>
        </TextSection>

        <TextSection heading="Questions">
          <p>
            Anything unclear, including permission requests, goes to{" "}
            <a href={`mailto:${EMAIL}`} style={textLinkStyle}>
              {EMAIL}
            </a>{" "}
            or the{" "}
            <Link href="/contact" style={textLinkStyle}>
              contact page
            </Link>
            .
          </p>
        </TextSection>
      </TextPage>
    </>
  );
}
