"use client";

import { trackFileDownload, type DownloadCategory } from "@/lib/analytics";

interface DownloadLinkProps {
  href: string;
  asset: string;
  category: DownloadCategory;
  download?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * A file download that reports itself before the browser takes over.
 *
 * Downloads are invisible to page-view analytics: the browser fetches the file
 * without a navigation, so nothing is recorded unless the click is captured
 * here.
 */
export function DownloadLink({
  href,
  asset,
  category,
  download = true,
  className,
  style,
  children,
}: DownloadLinkProps): React.ReactElement {
  return (
    <a
      href={href}
      download={download || undefined}
      className={className}
      style={style}
      onClick={() => trackFileDownload({ asset, category })}
    >
      {children}
    </a>
  );
}
