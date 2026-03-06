import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

async function loadMonospaceFont(): Promise<ArrayBuffer> {
  const css = await (
    await fetch(
      "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400&display=swap",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      }
    )
  ).text();

  const match = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );
  if (!match?.[1]) {
    throw new Error("Could not extract font URL from Google Fonts CSS");
  }

  return await (await fetch(match[1])).arrayBuffer();
}

interface OgImageOptions {
  title: string[];
  subtitle?: string;
  accent?: string;
}

export async function renderOgImage({
  title,
  subtitle,
  accent,
}: OgImageOptions): Promise<ImageResponse> {
  const fontData = await loadMonospaceFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px",
          backgroundColor: "#121212",
          fontFamily: "Source Code Pro",
        }}
      >
        {/* Decorative dots (stars) */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex" }}>
          {[
            { x: 80, y: 60, o: 0.3 },
            { x: 200, y: 120, o: 0.4 },
            { x: 350, y: 40, o: 0.2 },
            { x: 500, y: 90, o: 0.5 },
            { x: 700, y: 50, o: 0.3 },
            { x: 850, y: 80, o: 0.4 },
            { x: 1000, y: 60, o: 0.2 },
            { x: 1100, y: 110, o: 0.5 },
            { x: 120, y: 520, o: 0.3 },
            { x: 300, y: 560, o: 0.4 },
            { x: 500, y: 540, o: 0.2 },
            { x: 750, y: 570, o: 0.5 },
            { x: 900, y: 520, o: 0.3 },
            { x: 1050, y: 550, o: 0.4 },
          ].map((dot, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: dot.x,
                top: dot.y,
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: `rgba(255, 255, 255, ${dot.o})`,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          {title.map((line, i) => (
            <span
              key={i}
              style={{
                fontSize: i === 0 ? 48 : 80,
                color: i === 0 ? "rgba(255, 255, 255, 0.8)" : "#ffffff",
                letterSpacing: "-1px",
              }}
            >
              {line}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <span
            style={{
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: 24,
            }}
          >
            {subtitle}
          </span>
        )}

        {/* Accent text */}
        {accent && (
          <span
            style={{
              fontSize: 24,
              color: "#fcde09",
              marginTop: 20,
              letterSpacing: "2px",
            }}
          >
            {accent}
          </span>
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Source Code Pro",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
