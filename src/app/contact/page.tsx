import type { Metadata } from "next";
import Link from "next/link";
import { TextPage, TextSection, textLinkStyle } from "@/components/TextPage";
import { siteUrl } from "@/lib/site";
import { buildBreadcrumbJsonLd } from "../_lib/breadcrumbs";

const EMAIL = "book@midnightcoderschildren.com";
const DESCRIPTION =
  "Press enquiries, review copies, rights, bulk orders, and event invitations for The Midnight Coder's Children by Prashant Sridharan.";

export const metadata: Metadata = {
  title: "Contact | The Midnight Coder's Children",
  description: DESCRIPTION,
  alternates: {
    canonical: siteUrl("/contact"),
    languages: {
      "en-US": siteUrl("/contact"),
      "x-default": siteUrl("/contact"),
    },
  },
  openGraph: {
    title: "Contact | The Midnight Coder's Children",
    description: DESCRIPTION,
    url: siteUrl("/contact"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | The Midnight Coder's Children",
    description: DESCRIPTION,
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": siteUrl("/contact#page"),
  url: siteUrl("/contact"),
  name: "Contact",
  description: DESCRIPTION,
  inLanguage: "en-US",
  isPartOf: { "@id": siteUrl("/#website") },
  about: { "@id": siteUrl("/#book") },
  mainEntity: {
    "@id": siteUrl("/#organization"),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Media Relations",
        email: EMAIL,
        availableLanguage: ["en"],
        areaServed: "Worldwide",
      },
      {
        "@type": "ContactPoint",
        contactType: "Sales",
        email: EMAIL,
        availableLanguage: ["en"],
        areaServed: "Worldwide",
      },
    ],
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#contact-methods"],
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Contact", path: "/contact" },
]);

export default function ContactPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TextPage
        eyebrow="Contact"
        title="Get in touch"
        intro="Everything below reaches the same inbox. Say which one you are and it gets answered faster."
      >
        <div id="contact-methods">
          <TextSection heading="Press and reviews">
            <p>
              Review copies, interviews, podcast bookings, and festival
              invitations. Galleys are available in EPUB and print.
            </p>
            <p>
              <a href={`mailto:${EMAIL}`} style={textLinkStyle}>
                {EMAIL}
              </a>
            </p>
            <p>
              Cover art, author photography, and the full premise are already
              packaged on the{" "}
              <Link href="/press-kit" style={textLinkStyle}>
                press kit page
              </Link>
              , which needs no permission to use.
            </p>
          </TextSection>

          <TextSection heading="Rights and permissions">
            <p>
              Translation, audio, film, and television rights are handled
              directly. Quotation beyond a short excerpt, and any reproduction
              of the novel&apos;s text, needs written permission first.
            </p>
            <p>
              <a href={`mailto:${EMAIL}`} style={textLinkStyle}>
                {EMAIL}
              </a>
            </p>
          </TextSection>

          <TextSection heading="Bulk and book club orders">
            <p>
              Book clubs, libraries, and course adoptions can order at a
              discount. The{" "}
              <Link href="/book-club" style={textLinkStyle}>
                book club guide
              </Link>{" "}
              is free to download and free to photocopy.
            </p>
          </TextSection>

          <TextSection heading="Readers">
            <p>
              Notes about the book are read, and mostly answered. Order problems
              with a direct purchase go to the same address, with the email
              receipt attached.
            </p>
          </TextSection>
        </div>

        <TextSection heading="For agents and crawlers">
          <p>
            Contact details are published in machine-readable form too. Every
            page carries an Organization with a ContactPoint, and{" "}
            <Link href="/developers" style={textLinkStyle}>
              the developer page
            </Link>{" "}
            documents the agent files, the endpoints, and the reuse terms.
          </p>
        </TextSection>
      </TextPage>
    </>
  );
}
