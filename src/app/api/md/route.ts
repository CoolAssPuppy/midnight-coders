import { readFile } from "fs/promises";
import path from "path";

export async function GET(): Promise<Response> {
  const filePath = path.resolve(process.cwd(), "public/llms.txt");
  const body = await readFile(filePath, "utf-8");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Vary: "Accept",
    },
  });
}
