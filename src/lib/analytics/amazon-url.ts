import { readStoredCampaignParams, type CampaignParams } from "./campaign-params";

/**
 * Append first-party campaign params to an Amazon product URL.
 *
 * Leaves the ASIN path alone. Does not overwrite params Amazon already set
 * (tag, maas, ref_). Amazon ignores UTMs it does not use; they stay on the
 * URL so a later Attribution or Ads setup can read them.
 */
export function withAmazonCampaignParams(
  href: string,
  params: CampaignParams = readStoredCampaignParams(),
): string {
  if (!href.includes("amazon.")) return href;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }

  const entries = Object.entries(params).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );
  if (entries.length === 0) return href;

  for (const [key, value] of entries) {
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}
