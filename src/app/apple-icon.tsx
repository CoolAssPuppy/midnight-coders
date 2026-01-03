import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: "#121212",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontWeight: "bold",
        }}
      >
        <span style={{ color: "#fcde09" }}>0</span>
        <span style={{ color: "#ffffff" }}>1</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
