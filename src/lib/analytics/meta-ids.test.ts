import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_META_PIXEL_ID, resolveMetaCapiConfig } from "./meta-ids";

describe("Meta ids", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("wires the Midnight Coders pixel when env is empty", () => {
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "");
    vi.stubEnv("META_CONVERSIONS_ACCESS_TOKEN", "");
    vi.stubEnv("META_PIXEL_ID", "");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    vi.stubEnv("NEXT_PUBLIC_META_DATASET_ID", "");

    const config = resolveMetaCapiConfig();
    expect(config.accessToken).toBe("");
    expect(config.pixelId).toBe(DEFAULT_META_PIXEL_ID);
    expect(config.pixelId).toBe("1561129122079440");
  });

  it("prefers META_CAPI_ACCESS_TOKEN over the older name", () => {
    vi.stubEnv("META_CAPI_ACCESS_TOKEN", "new-token");
    vi.stubEnv("META_CONVERSIONS_ACCESS_TOKEN", "old-token");
    vi.stubEnv("META_PIXEL_ID", "999");

    expect(resolveMetaCapiConfig()).toEqual({
      accessToken: "new-token",
      pixelId: "999",
    });
  });
});
