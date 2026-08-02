/**
 * Layout renderers.
 *
 * Each layout returns the inner markup for one post at one size. Type sizes
 * are expressed at the 4:5 baseline and multiplied by the size's scale, so a
 * story and a square stay recognisably the same design rather than two
 * separate ones.
 */

import { COLORS, FONTS } from "./tokens.mjs";
import { CTA } from "./concepts.mjs";

/** Cover art width per layout and size, in output pixels. The 3D render has
 *  roughly 19% transparent padding on each side, so the book reads narrower
 *  than these numbers suggest. */
const COVER_WIDTH = {
  "cover-hook": { "4x5": 600, "9x16": 720, "1x1": 430 },
  quote: { "4x5": 560, "9x16": 700, "1x1": 460 },
};

export function px(value, scale) {
  return `${Math.round(value * scale)}px`;
}

function rule(scale, width = 56) {
  return `<span class="rule" style="width:${px(width, scale)}"></span>`;
}

/** The small mono label. Used where a post opens on a statement of source
 *  rather than on the story itself. */
function kicker(text, scale) {
  return `<div class="kicker">${rule(scale)}<span>${text}</span></div>`;
}

/** The serif billboard line. Sits above the cover and carries the post, so it
 *  is the largest type in the frame. */
function headline(text, scale) {
  return `<div class="headline-block">
      ${rule(scale, 72)}
      <p class="headline" style="font-size:${px(50, scale)};line-height:1.1">${text}</p>
    </div>`;
}

function callToAction(scale) {
  return `<div class="cta">
      <span class="cta-url">${CTA.url}</span>
      <span class="cta-release">${CTA.release}</span>
    </div>`;
}

function ribbon() {
  return `<div class="ribbon"><span>${CTA.ribbon}</span></div>`;
}

/**
 * Ribbon geometry, and how far the top copy has to stay clear of it.
 *
 * The band cuts the top-right corner, crossing the top edge `cut` px left of
 * it and the right edge `cut` px below it. Both ends have to run off the
 * canvas: if either one stops inside the clip box it gets squared off
 * mid-air, which is what a naive "centre the band in a square" version does.
 * So the band is longer than the chord it has to cover, and the box is sized
 * to hold the whole thing except where it leaves through the two canvas
 * edges.
 *
 * Its inner edge is the centre line pushed back by half the thickness. That
 * edge runs away to the right as it descends, so the tightest point is
 * wherever the top copy starts.
 */
function ribbonMetrics(size) {
  const { scale, width, pad, padTop } = size;
  const cut = 230 * scale;
  const thickness = 63 * scale;
  const overhang = 90 * scale;
  const length = cut * Math.SQRT2 + overhang;
  const box = Math.ceil(cut / 2 + ((length + thickness) / 2) * Math.SQRT1_2 + 20);

  // Where the headline's first line sits: the rule, then the gap under it.
  const copyTop = padTop + 2 + 26 * scale;
  const innerEdgeX = width - cut - thickness * Math.SQRT1_2 + copyTop;

  return {
    box,
    length: Math.round(length),
    thickness,
    // Centre of the band, in coordinates local to the clip box.
    centreX: Math.round(box - cut / 2),
    centreY: Math.round(cut / 2),
    fontSize: 19 * scale,
    padY: 20 * scale,
    topCopyWidth: Math.round(innerEdgeX - pad - 20),
  };
}

function cover(assetUrl, layout, sizeId) {
  const width = COVER_WIDTH[layout][sizeId];
  return `<img class="cover" src="${assetUrl(
    "images/book-cover/Midnight Coders Children Cover 3D.png"
  )}" style="width:${px(width, 1)}" alt="">`;
}

const LAYOUTS = {
  "cover-hook": (concept, size, assetUrl) => {
    const { scale, id } = size;
    const sub = concept.markSub
      ? `<p class="sub sub-marked" style="font-size:${px(26, scale)}"><mark>${concept.sub}</mark></p>`
      : `<p class="sub" style="font-size:${px(22, scale)}">${concept.sub}</p>`;

    return `<div class="frame stack">
        ${headline(concept.headline, scale)}
        <div class="cover-well">${cover(assetUrl, "cover-hook", id)}</div>
        <div class="copy">
          <p class="hook" style="font-size:${px(34, scale)};line-height:1.16">${concept.hook}</p>
          ${sub}
        </div>
        ${callToAction(scale)}
        ${ribbon()}
      </div>`;
  },

  quote: (concept, size, assetUrl) => {
    const { scale, id } = size;
    return `<div class="frame stack">
        ${kicker(concept.kicker, scale)}
        <div class="copy quote-copy">
          <p class="quote" style="font-size:${px(58, scale)};line-height:1.14">&ldquo;${concept.quote}&rdquo;</p>
          <p class="attribution" style="font-size:${px(17, scale)}">${rule(scale, 40)}${concept.attribution}</p>
        </div>
        <div class="cover-well">${cover(assetUrl, "quote", id)}</div>
        <div class="copy">
          <p class="sub" style="font-size:${px(23, scale)}">${concept.sub}</p>
        </div>
        ${callToAction(scale)}
        ${ribbon()}
      </div>`;
  },
};

export function renderLayout(concept, size, assetUrl) {
  const render = LAYOUTS[concept.layout];
  if (!render) {
    throw new Error(`Unknown layout: ${concept.layout}`);
  }
  return render(concept, size, assetUrl);
}

export function layoutStyles(size) {
  const { scale, pad, padTop, padBottom } = size;
  const ribbonStyle = ribbonMetrics(size);

  return `
    .frame {
      position:absolute; inset:0;
      padding:${px(padTop, 1)} ${px(pad, 1)} ${px(padBottom, 1)};
      display:flex; flex-direction:column;
      color:${COLORS.white};
    }
    .stack { justify-content:space-between; }

    .kicker { display:flex; align-items:center; gap:${px(16, scale)}; }
    .kicker span {
      font-family:${FONTS.mono};
      font-size:${px(15, scale)};
      letter-spacing:0.24em; text-transform:uppercase;
      color:${COLORS.dimmer};
    }
    .rule { display:inline-block; height:2px; background:${COLORS.accent}; flex:none; }

    .headline-block { display:flex; flex-direction:column; gap:${px(26, scale)}; }
    .headline {
      margin:0; font-family:${FONTS.display};
      color:${COLORS.white}; letter-spacing:-0.008em;
      max-width:${ribbonStyle.topCopyWidth}px;
    }

    .ribbon {
      position:absolute; top:0; right:0;
      width:${ribbonStyle.box}px; height:${ribbonStyle.box}px;
      overflow:hidden;
    }
    .ribbon span {
      position:absolute;
      left:${ribbonStyle.centreX}px; top:${ribbonStyle.centreY}px;
      display:block; width:${ribbonStyle.length}px;
      padding:${px(ribbonStyle.padY, 1)} 0;
      transform:translate(-50%, -50%) rotate(45deg);
      background:${COLORS.signal};
      color:#000000;
      text-align:center;
      font-family:${FONTS.mono};
      font-size:${px(ribbonStyle.fontSize, 1)};
      font-weight:bold;
      letter-spacing:0.16em; text-transform:uppercase;
      box-shadow:0 ${px(6, scale)} ${px(24, scale)} rgba(0,0,0,0.45);
    }

    .cover-well { flex:1; display:flex; align-items:center; justify-content:center; min-height:0; }
    .cover { height:auto; filter:drop-shadow(0 ${px(30, scale)} ${px(60, scale)} rgba(0,0,0,0.55)); }

    .copy { display:flex; flex-direction:column; gap:${px(16, scale)}; }
    .hook {
      margin:0; font-family:${FONTS.display};
      color:rgba(255,255,255,0.92); letter-spacing:-0.004em;
    }
    .sub {
      margin:0; font-family:${FONTS.body};
      line-height:1.55; color:${COLORS.dim};
      max-width:${px(820, scale)};
    }

    /* The site paints selected text teal on midnight. Borrowing those exact
       colours makes the line read as one somebody stopped and highlighted,
       rather than as a design flourish. */
    .sub-marked { margin-top:${px(6, scale)}; }
    .sub-marked mark {
      background-color:${COLORS.accent};
      color:${COLORS.midnight};
      padding:${px(4, scale)} ${px(10, scale)} ${px(6, scale)};
      box-decoration-break:clone;
      -webkit-box-decoration-break:clone;
    }

    .quote-copy { gap:${px(26, scale)}; margin-top:${px(44, scale)}; }
    .quote {
      margin:0; font-family:${FONTS.display};
      color:${COLORS.quote}; letter-spacing:-0.01em;
      max-width:${ribbonStyle.topCopyWidth}px;
    }
    .attribution {
      margin:0; display:flex; align-items:center; gap:${px(14, scale)};
      font-family:${FONTS.mono}; letter-spacing:0.22em; text-transform:uppercase;
      color:rgba(220,220,170,0.6);
    }
    .attribution .rule { background:rgba(220,220,170,0.6); }

    .cta {
      display:flex; flex-direction:column; gap:${px(6, scale)};
      margin-top:${px(38, scale)};
    }
    .cta-url {
      font-family:${FONTS.mono}; font-size:${px(17, scale)};
      letter-spacing:0.04em; color:${COLORS.dim};
    }
    .cta-release {
      font-family:${FONTS.mono}; font-size:${px(14, scale)};
      letter-spacing:0.2em; text-transform:uppercase; color:${COLORS.faint};
    }
  `;
}
