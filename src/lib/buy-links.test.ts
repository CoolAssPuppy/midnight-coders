import { describe, expect, it } from "vitest";
import {
  AMAZON_PAPERBACK_URL,
  BUY_LINKS,
} from "@/lib/buy-links";
import { createPricingMarkdown } from "@/lib/pricing";

describe("book purchase links", () => {
  it("names the edition sold by each external retailer link", () => {
    expect(BUY_LINKS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Buy Kindle on Amazon",
          retailer: "amazon",
        }),
        expect.objectContaining({
          label: "Buy paperback on Barnes & Noble",
          retailer: "barnes_and_noble",
        }),
      ]),
    );
  });

  it("lists the paperback Amazon ASIN in machine-readable pricing", () => {
    const markdown = createPricingMarkdown();
    const paperback = markdown.split("## Paperback")[1]?.split("## Free")[0];

    expect(paperback).toContain(AMAZON_PAPERBACK_URL);
    expect(paperback).not.toContain("B0HBGYKMH3");
  });
});
