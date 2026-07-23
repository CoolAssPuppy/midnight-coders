/**
 * The single canonical origin for the site.
 *
 * Production serves on the `www` host and 307s the apex domain to it, so every
 * canonical link, JSON-LD `@id`, sitemap entry and absolute URL has to use
 * `www`. Pointing them at the apex domain sends crawlers through a redirect and
 * splits the same page across two addresses.
 */
export const SITE_URL = "https://www.midnightcoderschildren.com";

/** Builds an absolute URL on the canonical origin. `path` starts with a slash. */
export function siteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
