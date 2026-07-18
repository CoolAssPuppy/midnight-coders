/**
 * Retail links for the book. A `null` href means the channel is not open yet
 * and should render as a disabled "coming soon" button.
 */
export type BuyLink = {
  label: string;
  href: string | null;
};

export const BUY_LINKS: BuyLink[] = [
  {
    label: "Buy on Amazon",
    href: "https://www.amazon.com/Midnight-Coders-Children-Prashant-Sridharan/dp/B0H9BLKH9M",
  },
  {
    label: "Buy on Barnes & Noble",
    href: "https://www.barnesandnoble.com/w/the-midnight-coders-children-prashant-sridharan/1150827730?ean=9798999111128",
  },
  {
    label: "Buy Direct from Author",
    href: null,
  },
];

/** Primary retail listing, used for structured data offers. */
export const PRIMARY_BUY_URL = BUY_LINKS[0].href as string;
