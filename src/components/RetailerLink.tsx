"use client";

import { trackBookRetailerClick, type BookRetailer } from "@/lib/analytics";

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
 * navigate: destinations queue their sends synchronously, and blocking
 * navigation on a network call would feel slow and break middle-click.
 */
export function RetailerLink({
  href,
  retailer,
  className,
  children,
}: RetailerLinkProps): React.ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackBookRetailerClick({ retailer, href })}
    >
      {children}
    </a>
  );
}
