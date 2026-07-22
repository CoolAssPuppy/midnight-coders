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

export const BUY_LINKS: BuyLink[] = [
  {
    label: "Buy on Amazon",
    href: "https://www.amazon.com/Midnight-Coders-Children-Prashant-Sridharan/dp/B0H9BLKH9M",
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

/** Primary retail listing, used for structured data offers. */
export const PRIMARY_BUY_URL = BUY_LINKS[0].href as string;
