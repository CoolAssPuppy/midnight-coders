import type { Metadata } from "next";
import Image from "next/image";
import { DigitalEditionCheckout } from "@/components/DigitalEditionCheckout";
import { RetailerLink } from "@/components/RetailerLink";
import { BUY_LINKS } from "@/lib/buy-links";
import "./buy.css";

const title = "Buy the digital edition";
const description =
  "Pre-order The Midnight Coder's Children digital edition direct from the author for $14.99. EPUB, DRM-free, delivered on release day, 22 September 2026.";
const canonical = "https://www.midnightcoderschildren.com/buy";

export const metadata: Metadata = {
  title: `${title} | The Midnight Coder's Children`,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const colophon: { term: string; detail: string }[] = [
  { term: "Format", detail: "EPUB, readable on Kindle, Kobo, Apple Books, and anything else" },
  { term: "Protection", detail: "None. No DRM, no account, no reader app. The file is yours." },
  { term: "Released", detail: "22 September 2026" },
  { term: "Delivery", detail: "A download link by email on release day" },
];

export default function BuyPage(): React.ReactElement {
  const retailers = BUY_LINKS.filter((link) => link.retailer && link.href);

  return (
    <main id="main-content" className="buy">
      <div className="buy__inner">
        <div className="buy__lede">
          <div className="buy__cover">
            <Image
              src="/images/book-cover/Midnight Coders Children Cover.jpg"
              alt="Cover of The Midnight Coder's Children by Prashant Sridharan"
              width={720}
              height={1080}
              priority
              sizes="(min-width: 60rem) 21rem, 76vw"
            />
          </div>

          <div>
            {/* One kicker, used once. The hour the novel opens. */}
            <p className="buy__timestamp buy__reveal buy__reveal--1">
              05:43 &middot; Digital edition
            </p>

            {/* The cover already carries the title at display size. Repeating
                it here would be redundant, so the h1 stays modest for structure
                and search, and the logline does the selling. */}
            <h1 className="buy__title buy__reveal buy__reveal--1">
              The Midnight Coder&rsquo;s Children
              <span className="buy__byline">A novel by Prashant Sridharan</span>
            </h1>

            <p className="buy__logline buy__reveal buy__reveal--2">
              Sydney McEnroe arrives at 5:43 a.m. to discover the worst has
              already happened.
            </p>

            <blockquote className="buy__quote buy__reveal buy__reveal--3">
              A brisk financial thriller buoyed by a powerful emotional
              throughline.
              <cite>BookLife</cite>
            </blockquote>

            <div className="buy__purchase buy__reveal buy__reveal--4">
              <p className="buy__price">
                <b>$14.99</b>
              </p>

              <p className="buy__ships">
                Pre-order. Download link active on 22 September 2026.
              </p>

              <DigitalEditionCheckout />
            </div>
          </div>
        </div>

        <dl className="buy__colophon buy__reveal buy__reveal--4">
          {colophon.map((entry) => (
            <div className="buy__row" key={entry.term}>
              <dt>{entry.term}</dt>
              <dd>{entry.detail}</dd>
            </div>
          ))}
        </dl>

        <section className="buy__alt buy__reveal buy__reveal--4">
          <p>Prefer print, or prefer a bookstore?</p>
          <div className="buy__retailers">
            {retailers.map((link) => (
              <RetailerLink
                key={link.label}
                href={link.href as string}
                retailer={link.retailer!}
                className="buy__retailer"
              >
                {link.label}
              </RetailerLink>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
