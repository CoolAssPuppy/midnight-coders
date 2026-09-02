import type { Metadata } from "next";
import Image from "next/image";
import { DigitalEditionCheckout } from "@/components/DigitalEditionCheckout";
import { ProductViewEvent } from "@/components/ProductViewEvent";
import { RetailerLink } from "@/components/RetailerLink";
import { RotatingPraise } from "@/components/RotatingPraise";
import { BUY_LINKS } from "@/lib/buy-links";
import { BOOK_AUTHOR, BOOK_TITLE, DIGITAL_PRICE, PAPERBACK_PRICE } from "@/lib/book-facts";
import { siteUrl } from "@/lib/site";
import "./buy.css";

const title = `Buy ${BOOK_TITLE} on Amazon | ${BOOK_AUTHOR}`;
const description =
  `Buy the paperback of ${BOOK_TITLE} by ${BOOK_AUTHOR} on Amazon. List price $${PAPERBACK_PRICE}. Also as a DRM-free EPUB for $${DIGITAL_PRICE}, and at Barnes & Noble. Released 15 September 2026 from Bodhi Press.`;
const canonical = siteUrl("/buy");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function BuyPage(): React.ReactElement {
  const amazon = BUY_LINKS.find((link) => link.retailer === "amazon");
  const barnes = BUY_LINKS.find((link) => link.retailer === "barnes_and_noble");

  return (
    <main id="main-content" className="buy">
      <ProductViewEvent />
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
            <h1 className="buy__title buy__reveal buy__reveal--1">
              The Midnight Coder&rsquo;s Children
              <span className="buy__byline">A novel by Prashant Sridharan</span>
            </h1>

            <p className="buy__logline buy__reveal buy__reveal--2">
              Sydney McEnroe arrives at 5:43 a.m. to discover the worst has
              already happened.
            </p>

            <div className="buy__purchase buy__reveal buy__reveal--3">
              <p className="buy__price">
                <b>${PAPERBACK_PRICE}</b>
                <span>Paperback</span>
              </p>

              <p className="buy__ships">
                Pre-order on Amazon. Released 15 September 2026.
              </p>

              {amazon?.href && (
                <div className="buy__actions">
                  <RetailerLink
                    href={amazon.href}
                    retailer="amazon"
                    className="checkout__button"
                  >
                    {amazon.label}
                  </RetailerLink>
                </div>
              )}

              <p className="buy__other">
                <span className="buy__other-label">Also: </span>
                {`DRM-free EPUB $${DIGITAL_PRICE}. `}
                <DigitalEditionCheckout inline className="buy__text-cta" />
                {barnes?.href && (
                  <>
                    <span className="buy__other-sep"> · </span>
                    <RetailerLink
                      href={barnes.href}
                      retailer="barnes_and_noble"
                      className="buy__text-cta"
                    >
                      {barnes.label}
                    </RetailerLink>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="buy__praise buy__reveal buy__reveal--4">
          <RotatingPraise />
        </div>
      </div>
    </main>
  );
}
