import { describe, it, expect } from "vitest";
import {
  STATEMENT_DESCRIPTOR_PREFIX,
  STATEMENT_DESCRIPTOR_SUFFIX,
  MAX_STATEMENT_DESCRIPTOR_LENGTH,
  DIGITAL_EDITION_LOOKUP_KEY,
  RELEASE_DATE_ISO,
} from "./stripe";

describe("card statement descriptor", () => {
  it("fits inside Stripe's 22 character limit once concatenated", () => {
    const combined = `${STATEMENT_DESCRIPTOR_PREFIX} ${STATEMENT_DESCRIPTOR_SUFFIX}`;

    // Stripe rejects the charge outright if this overflows, so a future book
    // with a long suffix would break checkout rather than degrade.
    expect(combined.length).toBeLessThanOrEqual(MAX_STATEMENT_DESCRIPTOR_LENGTH);
  });

  it("uses only characters Stripe permits in a suffix", () => {
    // No <, >, \, ", ' or *.
    expect(STATEMENT_DESCRIPTOR_SUFFIX).toMatch(/^[A-Za-z0-9 ]+$/);
  });

  it("names the book, not just the imprint", () => {
    // The prefix is account-level and shared across every title, so a suffix
    // equal to the imprint would tell the buyer nothing.
    expect(STATEMENT_DESCRIPTOR_SUFFIX.length).toBeGreaterThan(0);
    expect(STATEMENT_DESCRIPTOR_SUFFIX).not.toBe(STATEMENT_DESCRIPTOR_PREFIX);
  });
});

describe("Stripe configuration constants", () => {
  it("resolves the price by the lookup key configured in Stripe", () => {
    expect(DIGITAL_EDITION_LOOKUP_KEY).toBe("midnight-coders-digital");
  });

  it("has a release date that parses to a real instant", () => {
    expect(Number.isNaN(Date.parse(RELEASE_DATE_ISO))).toBe(false);
    expect(new Date(RELEASE_DATE_ISO).getUTCFullYear()).toBe(2026);
    expect(new Date(RELEASE_DATE_ISO).getUTCMonth()).toBe(8); // September
    expect(new Date(RELEASE_DATE_ISO).getUTCDate()).toBe(22);
  });
});
