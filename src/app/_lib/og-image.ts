import { readFile } from "fs/promises";
import path from "path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT =
  "The Midnight Coder's Children - A novel by Prashant Sridharan";

export async function serveOgImage(): Promise<Response> {
  const buffer = await readFile(
    path.resolve(process.cwd(), "public/images/og-image.png")
  );
  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
