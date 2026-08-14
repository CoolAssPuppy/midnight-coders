import type { BookRetailer } from "@/lib/analytics";

/**
 * Purchase links for the book.
 *
 * A `retailer` marks an outbound link to a store we do not own; those clicks
 * are the only conversion signal available for print sales, so they are
 * tracked. The direct link is internal and is measured by the checkout flow
 * itself instead.
 */
export type BuyLink = {
  label: string;
  href: string | null;
  retailer?: BookRetailer;
};

/**
 * The paperback listing, untagged. Structured data offers point here, so the
 * canonical URL an agent or crawler reads stays free of tracking parameters.
 * This edition ships through IngramSpark rather than KDP, which is why it is
 * absent from Amazon Attribution and cannot be measured.
 */
export const AMAZON_PAPERBACK_URL = "https://www.amazon.com/dp/B0H9BLKH9M";

/**
 * The Kindle edition, carrying its Amazon Attribution tag.
 *
 * Amazon is where roughly nine out of ten outbound buyers go, and without this
 * tag none of those sales are visible in any system we own: they never reach
 * Stripe, Meta, or PostHog. The tag was issued by the Amazon Ads console for
 * ad group `site-buy-links` under campaign `Midnight Coders - offsite`, and it
 * reports clicks, purchases, and royalties back against the Kindle ASIN.
 *
 * Kindle rather than paperback because Attribution only reports on KDP titles.
 */
const AMAZON_KINDLE_TAGGED_URL =
  "https://www.amazon.com/dp/B0HBGYKMH3?maas=maas_adg_FA0E8F0029ED5577D600F9D36BDF80C0_afap_abs&ref_=aa_maas&tag=maas";

export const BUY_LINKS: BuyLink[] = [
  {
    label: "Buy on Amazon",
    href: AMAZON_KINDLE_TAGGED_URL,
    retailer: "amazon",
  },
  {
    label: "Buy on Barnes & Noble",
    href: "https://www.barnesandnoble.com/w/the-midnight-coders-children-prashant-sridharan/1150827730?ean=9798999111128",
    retailer: "barnes_and_noble",
  },
  {
    label: "Buy Direct from Author",
    href: "/buy",
  },
];

/**
 * Primary retail listing, used for the paperback structured data offer.
 *
 * Deliberately not `BUY_LINKS[0].href`, which it used to be. That entry now
 * points at the tagged Kindle link, so deriving this from it put a Kindle URL
 * with tracking parameters inside a Paperback offer.
 */
export const PRIMARY_BUY_URL = AMAZON_PAPERBACK_URL;
