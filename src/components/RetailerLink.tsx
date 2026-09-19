"use client";

import { useEffect, useState } from "react";
import { trackBookRetailerClick, type BookRetailer } from "@/lib/analytics";
import { withAmazonCampaignParams } from "@/lib/analytics/amazon-url";
import {
  mergeCampaignParams,
  readPendingCampaignParams,
  readStoredCampaignParams,
  stashLandingCampaignParams,
} from "@/lib/analytics/campaign-params";
import {
  hasMarketingConsent,
  subscribeMarketingConsent,
} from "@/lib/consent";

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
 * Same-tab on purpose. Facebook and Instagram in-app browsers drop or ignore
 * `target="_blank"`, which is most paid Meta traffic to /buy. Destinations
 * queue synchronously or beacon, so the unload does not cancel the click.
 * Middle-click and the browser's own open-in-new-tab still work.
 *
 * Amazon URLs pick up first-party UTMs once measurement is allowed. The ASIN
 * path is never rewritten.
 */
export function RetailerLink({
  href,
  retailer,
  className,
  children,
}: RetailerLinkProps): React.ReactElement {
  const [outbound, setOutbound] = useState(href);

  useEffect(() => {
    const apply = (): void => {
      if (retailer !== "amazon" || !hasMarketingConsent()) {
        setOutbound(href);
        return;
      }

      stashLandingCampaignParams(window.location.search);
      const params = mergeCampaignParams(
        readStoredCampaignParams(),
        readPendingCampaignParams(),
      );
      setOutbound(withAmazonCampaignParams(href, params));
    };

    apply();
    return subscribeMarketingConsent(apply);
  }, [href, retailer]);

  return (
    <a
      href={outbound}
      className={className}
      onClick={() => trackBookRetailerClick({ retailer, href: outbound })}
    >
      {children}
    </a>
  );
}
