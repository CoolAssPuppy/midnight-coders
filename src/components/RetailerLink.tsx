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
 * navigate: destinations queue their sends synchronously, and `target="_blank"`
 * means this page never unloads, so nothing cancels them. Blocking on a network
 * call would feel slow and break middle-click.
 *
 * If this ever drops `target="_blank"`, do not add a second Meta transport
 * alongside `fbq` to survive the unload. Two browser requests for one event are
 * counted twice. Switch the transport instead.
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
