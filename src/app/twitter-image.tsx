import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "./_lib/og-image";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Midnight Coder's Children - A novel by Prashant Sridharan";

export default function TwitterImage() {
  return renderOgImage({
    title: ["The", "Midnight", "Coder's", "Children"],
    subtitle: "by Prashant Sridharan",
    accent: "Coming September 2026",
  });
}
