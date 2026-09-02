import { sanitizePixelId } from "./pixel-id";

/**
 * Meta Pixel / dataset for Midnight Coders (Ads Manager name: Midnight Coders).
 *
 * Public by design. The Conversions API token is the secret half and never
 * belongs in this file.
 */
export const DEFAULT_META_PIXEL_ID = "1561129122079440";

export function resolvePublicMetaPixelId(): string {
  return (
    sanitizePixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID) ||
    sanitizePixelId(process.env.NEXT_PUBLIC_META_DATASET_ID) ||
    sanitizePixelId(process.env.META_PIXEL_ID) ||
    DEFAULT_META_PIXEL_ID
  );
}

export function resolveMetaCapiConfig(): {
  accessToken: string;
  pixelId: string;
} {
  const accessToken =
    process.env.META_CAPI_ACCESS_TOKEN ||
    process.env.META_CONVERSIONS_ACCESS_TOKEN ||
    "";

  const pixelId =
    sanitizePixelId(process.env.META_PIXEL_ID) ||
    sanitizePixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID) ||
    sanitizePixelId(process.env.NEXT_PUBLIC_META_DATASET_ID) ||
    DEFAULT_META_PIXEL_ID;

  return { accessToken, pixelId };
}
