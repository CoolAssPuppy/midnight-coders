/**
 * Headless Chrome rendering.
 *
 * Chrome does the compositing so the posts use the same CSS as the site: real
 * font rendering, real blend modes, real drop shadows.
 */

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { backgroundMarkup, backgroundStyles, seedFrom } from "./tokens.mjs";
import { renderLayout, layoutStyles } from "./layouts.mjs";

const run = promisify(execFile);

export const ROOT = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const PUBLIC_DIR = path.join(ROOT, "public");

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

export function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      "No Chrome binary found. Set CHROME_PATH to a Chrome or Chromium executable."
    );
  }
  return found;
}

export const assetUrl = (relativePath) =>
  pathToFileURL(path.join(PUBLIC_DIR, relativePath)).href;

/**
 * Extra rules for the two plates a motion loop is built from.
 *
 * The cover has to drift independently of the type, so it is rendered onto its
 * own transparent layer while the rest of the composition is rendered without
 * it. Both plates keep the full frame and the real layout, so the cover lands
 * in exactly the position it holds in the still. Hiding is done with
 * `visibility` rather than `display` for the same reason: the boxes must stay
 * where they are.
 */
const LAYER_STYLES = {
  base: `.cover { visibility:hidden !important; }`,
  cover: `
    html, body { background:transparent !important; }
    .bg { display:none !important; }
    .frame > *:not(.cover-well) { visibility:hidden !important; }
  `,
};

/**
 * Build the page for one post at one size.
 *
 * `includeBands` is off for motion plates: the video paints its own bands over
 * time, and baked-in ones would sit under them permanently.
 */
export function documentFor(
  concept,
  size,
  { includeBands = true, layer = null } = {}
) {
  const seed = seedFrom(`${concept.id}-${size.id}`);
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${concept.id} ${size.id}</title>
<style>
  * { box-sizing:border-box; }
  html, body { margin:0; padding:0; background:#0a1628; }
  body { width:${size.width}px; height:${size.height}px; overflow:hidden; }
  .canvas { position:relative; width:${size.width}px; height:${size.height}px; overflow:hidden; }
  ${backgroundStyles(assetUrl)}
  ${layoutStyles(size)}
  ${layer ? LAYER_STYLES[layer] : ""}
</style></head>
<body>
  <div class="canvas">
    ${backgroundMarkup(seed, { includeBands })}
    ${renderLayout(concept, size, assetUrl)}
  </div>
</body></html>`;
}

export async function shoot(
  chrome,
  htmlPath,
  outPath,
  size,
  { transparent = false } = {}
) {
  await run(chrome, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=4000",
    ...(transparent ? ["--default-background-color=00000000"] : []),
    `--window-size=${size.width},${size.height}`,
    `--screenshot=${outPath}`,
    pathToFileURL(htmlPath).href,
  ]);
}

/**
 * Emit a JPEG next to the PNG. Instagram, LinkedIn, and X all recompress on
 * upload, so shipping a JPEG saves a round of quality loss and keeps the files
 * small enough to attach anywhere. Best effort: PNG is the master.
 */
export async function toJpeg(pngPath) {
  const jpegPath = pngPath.replace(/\.png$/, ".jpg");
  try {
    await run("sips", [
      "-s", "format", "jpeg",
      "-s", "formatOptions", "92",
      pngPath, "--out", jpegPath,
    ]);
    return true;
  } catch {
    return false;
  }
}
