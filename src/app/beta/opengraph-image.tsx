import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "../_lib/og-image";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Beta Readers - The Midnight Coder's Children";

export default function OgImage() {
  return renderOgImage({
    title: ["Beta", "Readers"],
    subtitle: "The Midnight Coder's Children",
    accent: "by Prashant Sridharan",
  });
}
