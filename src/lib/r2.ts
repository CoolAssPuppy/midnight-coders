import { AwsClient } from "aws4fetch";

/**
 * Cloudflare R2, via its S3-compatible API.
 *
 * The bucket is private. The download route verifies a signed token, then hands
 * the reader a presigned URL that expires shortly after. Redirecting rather than
 * streaming means the file bytes never pass through a Vercel function, so a
 * multi-megabyte EPUB costs no function time and no bandwidth.
 *
 * aws4fetch rather than the AWS SDK: it is a few kilobytes against the SDK's
 * megabytes, which matters for serverless cold starts when all we need is a
 * SigV4 signature.
 */

/** How long a presigned URL stays usable. Long enough to start a download on a
 *  slow connection, short enough that a shared URL dies quickly. */
export const PRESIGNED_URL_TTL_SECONDS = 900;

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  objectKey: string;
}

export type R2ConfigResult =
  | { ok: true; config: R2Config }
  | { ok: false; missing: string[] };

/**
 * Read R2 configuration from the environment.
 *
 * Returns which variables are missing rather than throwing, so the caller can
 * log something actionable instead of a generic failure.
 */
export function readR2Config(): R2ConfigResult {
  const values = {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
    objectKey: process.env.R2_EPUB_KEY,
  };

  const envNames: Record<keyof typeof values, string> = {
    accountId: "R2_ACCOUNT_ID",
    accessKeyId: "R2_ACCESS_KEY_ID",
    secretAccessKey: "R2_SECRET_ACCESS_KEY",
    bucket: "R2_BUCKET",
    objectKey: "R2_EPUB_KEY",
  };

  const missing = (Object.keys(values) as (keyof typeof values)[])
    .filter((key) => !values[key])
    .map((key) => envNames[key]);

  if (missing.length > 0) return { ok: false, missing };

  return { ok: true, config: values as R2Config };
}

export function buildObjectUrl(config: R2Config): string {
  // R2 uses path-style addressing on the account endpoint. The object key is
  // encoded per path segment so a key containing a slash stays a slash.
  const encodedKey = config.objectKey
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucket}/${encodedKey}`;
}

/**
 * Presign a GET for the ebook. The returned URL carries its own credentials in
 * the query string and needs no headers, so it can be handed straight to a
 * browser via a redirect.
 */
export async function presignEbookUrl(
  config: R2Config,
  ttlSeconds: number = PRESIGNED_URL_TTL_SECONDS,
): Promise<string> {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    // R2 ignores region but SigV4 requires one. "auto" is what Cloudflare
    // documents for the S3-compatible endpoint.
    region: "auto",
  });

  const url = new URL(buildObjectUrl(config));
  url.searchParams.set("X-Amz-Expires", String(ttlSeconds));

  const signed = await client.sign(new Request(url, { method: "GET" }), {
    aws: { signQuery: true },
  });

  return signed.url;
}
