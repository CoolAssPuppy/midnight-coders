#!/usr/bin/env node
/**
 * Bundles the press kit media assets into a single downloadable zip.
 *
 * Source of truth for the asset list is src/lib/press-assets.json, shared with
 * the MediaAssets component. Files are copied under their clean downloadName so
 * the archive does not carry filenames with spaces.
 *
 * Run manually after changing assets, then commit the resulting zip:
 *   pnpm run press-kit:zip
 *
 * This is deliberately not part of `next build` -- the `zip` binary is not
 * guaranteed to exist in the deployment build image, and assets change rarely.
 */

import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const publicDir = path.join(projectRoot, "public");
const outputDir = path.join(publicDir, "press-kit");
const outputPath = path.join(outputDir, "midnight-coders-press-kit.zip");

const assets = JSON.parse(
  readFileSync(path.join(projectRoot, "src/lib/press-assets.json"), "utf8")
);

const stagingDir = mkdtempSync(path.join(tmpdir(), "press-kit-"));

try {
  for (const asset of assets) {
    const source = path.join(publicDir, asset.src);
    copyFileSync(source, path.join(stagingDir, asset.downloadName));
  }

  mkdirSync(outputDir, { recursive: true });
  rmSync(outputPath, { force: true });

  execFileSync(
    "zip",
    ["-j", "-q", outputPath, ...assets.map((a) => path.join(stagingDir, a.downloadName))],
    { stdio: "inherit" }
  );

  console.log(
    `Wrote ${path.relative(projectRoot, outputPath)} with ${assets.length} assets.`
  );
} finally {
  rmSync(stagingDir, { recursive: true, force: true });
}
