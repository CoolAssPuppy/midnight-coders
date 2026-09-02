"use client";

import { useEffect, useState } from "react";
import { trackBookRetailerClick, type BookRetailer } from "@/lib/analytics";
import { withAmazonCampaignParams } from "@/lib/analytics/amazon-url";

interface RetailerLinkProps {
  href: string;
  retailer: BookRetailer;
  className?: string;
  children: React.ReactNode;
}

/**
 * An outbound link to a bookstore that records the click before handing the
 * reader off.
 *
 * A plain anchor with a click handler, rather than preventDefault then
 * navigate: destinations queue their sends synchronously, and `target="_blank"`
 * means this page never unloads, so nothing cancels them. Blocking on a network
 * call would feel slow and break middle-click.
 *
 * Amazon URLs pick up first-party UTMs after consent. The ASIN path is never
 * rewritten.
 */
export function RetailerLink({
  href,
  retailer,
  className,
  children,
}: RetailerLinkProps): React.ReactElement {
  const [outbound, setOutbound] = useState(href);

  useEffect(() => {
    setOutbound(
      retailer === "amazon" ? withAmazonCampaignParams(href) : href,
    );
  }, [href, retailer]);

  return (
    <a
      href={outbound}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackBookRetailerClick({ retailer, href: outbound })}
    >
      {children}
    </a>
  );
}
