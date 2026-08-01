/**
 * Shared design tokens and the background treatment for social posts.
 *
 * The background is a static rebuild of the homepage `GlitchEffect`: the same
 * midnight base, the same tiled pattern at 7% screened, the same 4px scan
 * lines, a handful of frozen glitch bands, and the same vignette. Motion is
 * the only thing a still cannot carry, so the bands are seeded per post to
 * keep every render reproducible while no two posts look identical.
 */

export const COLORS = {
  midnight: "#0a1628",
  accent: "#4EC9B0",
  white: "#ffffff",
  dim: "rgba(255, 255, 255, 0.72)",
  dimmer: "rgba(255, 255, 255, 0.45)",
  faint: "rgba(255, 255, 255, 0.28)",
  quote: "#DCDCAA",
};

export const FONTS = {
  display: '"Didot", "Bodoni 72", Georgia, serif',
  body: 'Georgia, "Times New Roman", serif',
  mono: 'Menlo, Monaco, Consolas, "Courier New", monospace',
};

/**
 * Output geometry. Every asset is 1080 wide so nothing is upscaled on feed.
 * The 9:16 story keeps 190px clear at the top and 250px at the bottom, which
 * is where Instagram and TikTok paint their own chrome over the image.
 */
export const SIZES = [
  { id: "4x5", label: "Vertical feed", width: 1080, height: 1350, pad: 88, padTop: 88, padBottom: 88, scale: 1 },
  { id: "9x16", label: "Story and Reel cover", width: 1080, height: 1920, pad: 96, padTop: 190, padBottom: 250, scale: 1.1 },
  { id: "1x1", label: "Square feed", width: 1080, height: 1080, pad: 80, padTop: 80, padBottom: 80, scale: 0.85 },
];

export const GLITCH_COLORS = [
  "rgba(0, 255, 200, 0.15)",
  "rgba(255, 0, 50, 0.12)",
  "rgba(0, 255, 100, 0.1)",
];

/** Scan lines, as the homepage draws them: a 4px cadence of near-black at 15%,
 *  held at 20% opacity and lifted to 60% for the length of a glitch. */
export const SCAN_LINES = {
  period: 4,
  thickness: 2,
  alpha: 0.15,
  restOpacity: 0.2,
  flickerOpacity: 0.6,
};

/** Deterministic PRNG so a given post id always renders the same bands. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** A seeded random source, for callers that need to schedule their own events. */
export function makeRandom(seed) {
  return mulberry32(seed);
}

export function glitchBands(seed, count) {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const left = random() * 58;
    const room = 100 - left;
    return {
      top: random() * 100,
      left,
      width: room * 0.15 + random() * room * 0.6,
      height: 0.35 + random() * 1.6,
      shift: (random() - 0.5) * 12,
      skew: (random() - 0.5) * 2,
      opacity: 0.35 + random() * 0.4,
      color: GLITCH_COLORS[Math.floor(random() * GLITCH_COLORS.length)],
    };
  });
}

export function backgroundMarkup(seed, { includeBands = true } = {}) {
  const bands = (includeBands ? glitchBands(seed, 6) : [])
    .map(
      (band) => `<div class="band" style="
        top:${band.top.toFixed(2)}%;
        left:${band.left.toFixed(2)}%;
        width:${band.width.toFixed(2)}%;
        height:${band.height.toFixed(2)}%;
        background:${band.color};
        opacity:${band.opacity.toFixed(2)};
        transform:skewX(${band.skew.toFixed(2)}deg) translateX(${band.shift.toFixed(1)}px);
        box-shadow:${band.shift.toFixed(1)}px 0 ${Math.abs(band.shift * 2).toFixed(1)}px ${band.color};
      "></div>`
    )
    .join("");

  return `<div class="bg" aria-hidden="true">
      <div class="bg-base"></div>
      <div class="bg-pattern"></div>
      <div class="bg-scan"></div>
      ${bands}
      <div class="bg-vignette"></div>
    </div>`;
}

export function backgroundStyles(assetUrl) {
  return `
    .bg { position:absolute; inset:0; overflow:hidden; }
    .bg-base { position:absolute; inset:0; background:${COLORS.midnight}; }
    .bg-pattern {
      position:absolute; inset:0;
      background-image:url("${assetUrl("images/bg-pattern.jpg")}");
      background-size:400px; background-repeat:repeat;
      opacity:0.09; mix-blend-mode:screen;
    }
    .bg-scan {
      position:absolute; inset:0; opacity:0.2;
      background-image:repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
    }
    .band { position:absolute; mix-blend-mode:screen; }
    .bg-vignette {
      position:absolute; inset:0;
      background:radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%);
    }
  `;
}
