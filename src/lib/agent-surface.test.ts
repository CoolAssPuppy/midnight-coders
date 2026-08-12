import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { RULES, renderRobotsTxt } from "./robots-rules";
import { createLlmsIndex } from "./llms";
import { createPricingMarkdown } from "./pricing";
import { RATE_LIMITS, createOpenApiDocument } from "./openapi";
import { blurbParagraphs } from "./book-blurb";
import { DIGITAL_PRICE, PAPERBACK_PRICE } from "./book-facts";
import sitemap from "../app/sitemap";

const SRC = path.resolve(__dirname, "..");

/** Every file named `name` under `dir`, as paths relative to `dir`. */
function findFiles(dir: string, name: string, prefix = ""): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      return findFiles(path.join(dir, entry.name), name, rel);
    }
    return entry.name === name ? [rel] : [];
  });
}

function rulesFor(agent: string) {
  return RULES.find((rule) => rule.userAgent === agent);
}

describe("robots.txt", () => {
  it("allows the retrieval crawlers that recommend books", () => {
    for (const agent of [
      "OAI-SearchBot",
      "ChatGPT-User",
      "Claude-User",
      "PerplexityBot",
      "Amzn-SearchBot",
      "Amzn-User",
    ]) {
      expect(rulesFor(agent)?.allow, `${agent} should be allowed`).toContain("/");
    }
  });

  it("blocks Amazonbot while allowing Amazon's non-training crawlers", () => {
    // Amazonbot was allowed here on the mistaken belief that it was retrieval
    // only. Amazon documents that it may be used to train Amazon AI models,
    // which contradicts ai-train=no. Amzn-SearchBot and Amzn-User do not train
    // and carry the Alexa and Rufus discovery this site actually wants.
    expect(rulesFor("Amazonbot")?.disallow).toContain("/");
    expect(rulesFor("Amazonbot")?.allow ?? []).toEqual([]);
    expect(rulesFor("Amzn-SearchBot")?.allow).toContain("/");
    expect(rulesFor("Amzn-User")?.allow).toContain("/");
  });

  it("blocks every crawler whose purpose is collecting training data", () => {
    // This site publishes a novel and Chapter 1 is on it in full. Google and
    // Apple's crawlers are blocked here even though they are allowed on
    // strategicnerds.com, because there the content is marketing and here it
    // is the product.
    for (const agent of [
      "GPTBot",
      "ClaudeBot",
      "CCBot",
      "Google-Extended",
      "Applebot-Extended",
      "Meta-ExternalAgent",
    ]) {
      const rule = rulesFor(agent);

      expect(rule, `${agent} should have a rule`).toBeDefined();
      expect(rule?.allow ?? []).toEqual([]);
      expect(rule?.disallow).toContain("/");
    }
  });

  it("declares ai-train=no alongside those rules", () => {
    const body = renderRobotsTxt();

    expect(body).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=no");
    expect(body).toContain("Sitemap: https://www.midnightcoderschildren.com/sitemap.xml");
  });

  it("keeps the API and ad assets out of the wildcard crawl", () => {
    expect(rulesFor("*")?.disallow).toEqual(["/api/", "/ads/"]);
  });
});

describe("llms.txt", () => {
  it("tells an agent what to cite and what not to reproduce", () => {
    const index = createLlmsIndex();

    expect(index).toContain("## When to use this site");
    expect(index).toContain("Do not reproduce the novel's prose");
    expect(index).toContain("ai-train=no");
  });

  it("carries the synopsis rather than only linking to it", () => {
    const index = createLlmsIndex();

    for (const paragraph of blurbParagraphs()) {
      expect(index).toContain(paragraph);
    }
  });

  it("lists only pages that exist", () => {
    // The previous hand-maintained file advertised a /beta page that had been
    // removed and omitted /buy entirely.
    const index = createLlmsIndex();
    const listed = [...index.matchAll(/midnightcoderschildren\.com(\/[a-z-]*)\)/g)]
      .map((match) => match[1])
      .filter((path) => path !== "/" && !path.includes("."));
    const known = new Set(
      sitemap().map((entry) => new URL(entry.url).pathname)
    );

    expect(listed.length).toBeGreaterThan(0);
    for (const path of listed) {
      expect(known, `${path} should be a real page`).toContain(path);
    }
    expect(index).not.toContain("/beta");
  });

  it("quotes the same prices as pricing.md", () => {
    const index = createLlmsIndex();
    const pricing = createPricingMarkdown();

    for (const price of [DIGITAL_PRICE, PAPERBACK_PRICE]) {
      expect(index).toContain(price);
      expect(pricing).toContain(price);
    }
  });
});

describe("llms-full.txt", () => {
  /**
   * This one is still a hand-written file in public/, because its character
   * and premise sections have no equivalent in lib. That is exactly how the
   * old llms.txt rotted, so its URLs are checked against the sitemap here.
   */
  const content = readFileSync(
    path.resolve(SRC, "../public/llms-full.txt"),
    "utf8"
  );

  it("uses the canonical www host everywhere", () => {
    // The apex domain 307s to www, so an apex URL sends every crawler through
    // a redirect and splits the page across two addresses.
    expect(content).not.toMatch(/https:\/\/midnightcoderschildren\.com/);
  });

  it("lists only pages that exist", () => {
    const listed = [
      ...content.matchAll(/^- (https:\/\/www\.midnightcoderschildren\.com\S*)/gm),
    ].map((match) => new URL(match[1]).pathname.replace(/\/$/, "") || "/");
    const known = new Set(sitemap().map((entry) => new URL(entry.url).pathname));

    expect(listed.length).toBeGreaterThan(5);
    for (const page of listed) {
      expect(known, `${page} should be a real page`).toContain(page);
    }
  });

  it("lists the page that takes money", () => {
    expect(content).toContain("midnightcoderschildren.com/buy");
  });
});

describe("pricing.md", () => {
  it("prices both editions and says who sets each one", () => {
    const pricing = createPricingMarkdown();

    expect(pricing).toContain(`${DIGITAL_PRICE} USD`);
    expect(pricing).toContain(`${PAPERBACK_PRICE} USD`);
    expect(pricing).toContain("Stripe sets the final price");
    expect(pricing).toContain("Retailers set their own prices");
  });

  it("agrees with the price shown on the buy page", () => {
    const buyPage = readFileSync(
      path.join(SRC, "app/buy/page.tsx"),
      "utf8"
    );

    expect(buyPage).toContain(`$${DIGITAL_PRICE}`);
  });
});

describe("openapi.json", () => {
  it("describes only anonymous read endpoints", () => {
    const doc = createOpenApiDocument();

    for (const [route, item] of Object.entries(doc.paths)) {
      expect(Object.keys(item), `${route} should only expose GET`).toEqual([
        "get",
      ]);
    }
    expect(doc).not.toHaveProperty("security");
  });

  it("publishes rate limits that match the routes they describe", () => {
    for (const limit of RATE_LIMITS) {
      const file = limit.route.replace("{token}", "[token]");
      const source = readFileSync(
        path.join(SRC, "app", file, "route.ts"),
        "utf8"
      );
      const max = Number(source.match(/\bmax:\s*(\d+)/)?.[1]);
      const windowMs = source
        .match(/\bwindowMs:\s*([\d\s*]+),/)?.[1]
        ?.split("*")
        .map((part) => Number(part.trim()))
        .reduce((product, value) => product * value, 1);

      expect(max, `${limit.route} max`).toBe(limit.max);
      expect((windowMs ?? 0) / 60000, `${limit.route} window`).toBe(
        limit.windowMinutes
      );
    }
  });

  it("documents every route that is actually rate limited", () => {
    // Looping over RATE_LIMITS could only check what was already listed, so an
    // undocumented route passed silently. Stripe checkout was rate limited and
    // missing for exactly that reason. This walks the API directory instead,
    // making the code the source of truth.
    const apiDir = path.join(SRC, "app/api");
    const limited = findFiles(apiDir, "route.ts")
      .filter((file) =>
        /\bapplyRateLimit\s*\(/.test(readFileSync(path.join(apiDir, file), "utf8"))
      )
      .map(
        (file) =>
          "/api/" +
          path
            .dirname(file)
            .split("/")
            .map((seg) => seg.replace(/^\[(?:\.\.\.)?(.+)\]$/, "{$1}"))
            .join("/")
      );

    expect(limited.length).toBeGreaterThan(0);

    const documented = new Set(RATE_LIMITS.map((l) => l.route));
    for (const route of limited) {
      expect(documented, `${route} is rate limited but undocumented`).toContain(
        route
      );
    }
  });
});

describe("sitemap", () => {
  it("includes the page that takes money", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);

    expect(paths).toContain("/buy");
  });

  it("includes the trust anchor pages", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);

    for (const page of ["/contact", "/privacy", "/terms"]) {
      expect(paths).toContain(page);
    }
  });
});
