import { readFile } from "fs/promises";
import path from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Midnight Coder's Children - A novel by Prashant Sridharan";

export default async function OgImage(): Promise<Response> {
  const buffer = await readFile(
    path.resolve(process.cwd(), "public/images/og-image.png")
  );
  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
