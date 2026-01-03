import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
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
