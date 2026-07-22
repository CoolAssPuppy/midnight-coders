/**
 * Pixel and dataset ids are interpolated into inline `<script>` bodies in the
 * root layout. They come from environment variables rather than source
 * literals, so although only someone with deploy access can set them, they are
 * constrained to the character set real ids actually use. A value containing a
 * quote or semicolon would otherwise break out of the surrounding string
 * literal and execute.
 */
export function sanitizePixelId(value: string | undefined): string {
  if (!value) return "";

  const cleaned = value.trim().replace(/[^A-Za-z0-9_-]/g, "");

  if (cleaned !== value.trim()) {
    console.warn(
      "Pixel id contained unexpected characters and was sanitized. Check the environment variable.",
    );
  }

  return cleaned;
}
