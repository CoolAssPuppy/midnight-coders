import { describe, expect, it } from "vitest";
import {
  AMAZON_PAPERBACK_URL,
  BUY_LINKS,
} from "@/lib/buy-links";
import { createPricingMarkdown } from "@/lib/pricing";

describe("book purchase links", () => {
  it("makes the Amazon paperback the only primary purchase link", () => {
    expect(BUY_LINKS.filter((link) => link.prominence === "primary")).toEqual([
      expect.objectContaining({
        label: "Buy the paperback on Amazon",
        href: AMAZON_PAPERBACK_URL,
        retailer: "amazon",
      }),
    ]);
  });

  it("keeps Barnes & Noble and direct purchase as secondary links", () => {
    expect(BUY_LINKS.filter((link) => link.prominence === "secondary")).toEqual([
      expect.objectContaining({
        label: "Barnes & Noble",
        retailer: "barnes_and_noble",
      }),
      expect.objectContaining({
        label: "Buy direct",
        href: "/buy",
      }),
    ]);
  });

  it("lists the paperback Amazon ASIN in machine-readable pricing", () => {
    const markdown = createPricingMarkdown();
    const paperback = markdown.split("## Paperback")[1]?.split("## Free")[0];

    expect(paperback).toContain(AMAZON_PAPERBACK_URL);
    expect(paperback).not.toContain("B0HBGYKMH3");
  });
});
