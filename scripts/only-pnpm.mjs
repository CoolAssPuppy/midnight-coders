#!/usr/bin/env node
// Preinstall guard: refuse npm / yarn installs.
//
// Strategy: positively reject npm/yarn/bun when we see their UA
// prefix. Anything else (including an empty UA) is allowed.
// pnpm 11 does NOT always populate `npm_config_user_agent` for
// the workspace-root preinstall hook in CI environments — Vercel
// and GitHub Actions both reproduce this. A naive "must start
// with pnpm/" check therefore rejects pnpm itself on a fresh CI
// install while passing locally (because the hook is skipped on
// no-op installs). npm and yarn always set the UA, so the
// reject-list catches what we actually care about.
const ua = process.env.npm_config_user_agent || "";
const blocked = ["npm/", "yarn/", "bun/", "cnpm/"];
const match = blocked.find((prefix) => ua.startsWith(prefix));
if (!match) process.exit(0);
const tool = match.replace("/", "");
console.error(`\nThis repo uses pnpm. Detected ${tool}.`);
console.error('Install pnpm 11+ and run "pnpm install".\n');
process.exit(1);
