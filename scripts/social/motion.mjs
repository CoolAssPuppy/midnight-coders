/**
 * Motion loops.
 *
 * The still posts are rendered on a frozen version of the homepage glitch. The
 * loops take the same composition with the bands left off, then paint bands
 * over it frame by frame on the same rules the homepage uses: short bursts of
 * two to six coloured bands, screened, each carrying a horizontal shift and a
 * matching glow, with the scan lines lifting for the length of the burst.
 *
 * Frames are synthesised rather than screenshotted. Driving Chrome once per
 * frame would mean hundreds of browser launches per video; compositing over a
 * single rendered plate takes a couple of seconds instead.
 */

import { spawn } from "node:child_process";
import { createCanvas, loadImage } from "canvas";

import { GLITCH_COLORS, SCAN_LINES, glitchBands, makeRandom } from "./tokens.mjs";

export const MOTION = { fps: 30, seconds: 6 };

const TOTAL_FRAMES = MOTION.fps * MOTION.seconds;

/**
 * The homepage bands sit at 10 to 15 percent alpha, which is right for
 * something the eye catches out of the corner of a scroll. On a muted
 * autoplaying video in a feed they disappear, so motion runs them harder.
 */
const BAND_BOOST = 2.4;

/** Bursts above this intensity also tear a slice of the picture sideways. */
const SLICE_THRESHOLD = 0.78;

/**
 * The cover breathes. One full cycle per loop on each axis, so the last frame
 * lands exactly where the first one started and the loop point stays hidden.
 * The type never moves: it is what the eye reads, and drifting it would show.
 */
const COVER_DRIFT = { y: 6, x: 2.5, scale: 0.007 };

/**
 * The highlight sweep, as a fraction of the marked line revealed.
 *
 * It reads as somebody dragging a selection across the line: the copy sits
 * plain, the teal wipes in left to right, it holds, then it wipes back off.
 * Both ends of the loop rest unhighlighted, so the cut is invisible.
 */
const SWEEP = { start: 36, inEnd: 54, holdEnd: 126, outEnd: 144 };

function markReveal(frame) {
  if (frame <= SWEEP.start || frame >= SWEEP.outEnd) return 0;
  if (frame >= SWEEP.inEnd && frame <= SWEEP.holdEnd) return 1;

  const ease = (t) => t * t * (3 - 2 * t);
  if (frame < SWEEP.inEnd) {
    return ease((frame - SWEEP.start) / (SWEEP.inEnd - SWEEP.start));
  }
  return ease(1 - (frame - SWEEP.holdEnd) / (SWEEP.outEnd - SWEEP.holdEnd));
}

/** The drawn extent of a transparent plate, so the sweep spans the line and
 *  not the whole frame. */
function opaqueBounds(image, width, height) {
  const probe = createCanvas(width, height);
  const ctx = probe.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const { data } = ctx.getImageData(0, 0, width, height);

  let left = width;
  let right = -1;
  for (let y = 0; y < height; y += 1) {
    const row = y * width * 4;
    for (let x = 0; x < width; x += 1) {
      if (data[row + x * 4 + 3] > 8) {
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  return right < left
    ? { left: 0, width: 0 }
    : { left, width: right - left + 1 };
}

function coverTransform(frame) {
  const turn = (frame / TOTAL_FRAMES) * Math.PI * 2;
  return {
    x: Math.sin(turn + Math.PI / 3) * COVER_DRIFT.x,
    y: Math.sin(turn) * COVER_DRIFT.y,
    scale: 1 + COVER_DRIFT.scale * (0.5 - 0.5 * Math.cos(turn)),
  };
}

/**
 * Where the bursts fall across the loop.
 *
 * The last ten frames are always left quiet so the final frame and the first
 * frame are the same picture, and the loop point is invisible.
 */
function scheduleBursts(random) {
  const bursts = [];
  const limit = TOTAL_FRAMES - 10;
  let frame = 3 + Math.floor(random() * 8);

  while (frame < limit) {
    const duration = 2 + Math.floor(random() * 5);
    bursts.push({
      start: frame,
      end: Math.min(frame + duration, limit),
      seed: Math.floor(random() * 2 ** 30),
      count: 2 + Math.floor(random() * 5),
      intensity: 0.55 + random() * 0.45,
    });
    frame += duration + 3 + Math.floor(random() * 14);
  }

  return bursts;
}

/** The extra darkening that takes the scan lines from rest to flicker. */
function scanlineLayer(width, height) {
  const layer = createCanvas(width, height);
  const ctx = layer.getContext("2d");
  const alpha =
    SCAN_LINES.alpha * (SCAN_LINES.flickerOpacity - SCAN_LINES.restOpacity);

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  for (let y = SCAN_LINES.thickness; y < height; y += SCAN_LINES.period) {
    ctx.fillRect(0, y, width, SCAN_LINES.thickness);
  }
  return layer;
}

/**
 * Tear a horizontal slice of the picture sideways and fringe it in one of the
 * band colours. The cover art already carries this look, so displacing real
 * content reads as the same artefact rather than as an overlay.
 */
function paintSlices(ctx, burst, source, width, height) {
  const random = makeRandom(burst.seed ^ 0x9e3779b9);
  const count = 1 + Math.floor(random() * 3);

  for (let i = 0; i < count; i += 1) {
    const sliceHeight = 10 + random() * 64;
    const top = random() * (height - sliceHeight);
    const shift = (random() - 0.5) * 48;

    ctx.drawImage(
      source,
      0, top, width, sliceHeight,
      shift, top, width, sliceHeight
    );

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.5 * burst.intensity;
    ctx.fillStyle = GLITCH_COLORS[Math.floor(random() * GLITCH_COLORS.length)];
    ctx.fillRect(shift, top, width, sliceHeight);
    ctx.restore();
  }
}

function paintBurst(ctx, burst, width, height) {
  const bands = glitchBands(burst.seed, burst.count);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const band of bands) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, band.opacity * burst.intensity * BAND_BOOST);
    ctx.fillStyle = band.color;
    ctx.shadowColor = band.color;
    ctx.shadowBlur = Math.abs(band.shift) * 2;
    ctx.shadowOffsetX = band.shift;
    ctx.transform(1, 0, Math.tan((band.skew * Math.PI) / 180), 1, band.shift, 0);
    ctx.fillRect(
      (band.left / 100) * width,
      (band.top / 100) * height,
      (band.width / 100) * width,
      Math.max(2, (band.height / 100) * height)
    );
    ctx.restore();
  }

  ctx.restore();
}

/** Raw canvas bytes, with the row padding stripped if the backend added any. */
function frameBytes(canvas, width, height) {
  const raw = canvas.toBuffer("raw");
  const rowBytes = width * 4;
  if (raw.length === rowBytes * height) return raw;

  const stride = canvas.stride ?? raw.length / height;
  const packed = Buffer.allocUnsafe(rowBytes * height);
  for (let y = 0; y < height; y += 1) {
    raw.copy(packed, y * rowBytes, y * stride, y * stride + rowBytes);
  }
  return packed;
}

function write(stream, chunk) {
  return stream.write(chunk)
    ? Promise.resolve()
    : new Promise((resolve) => stream.once("drain", resolve));
}

/**
 * Encode one loop.
 *
 * MP4 rather than QuickTime, and with a silent stereo AAC track: Buffer and
 * the platforms reject or mangle a video-only .mov, and several of them treat
 * a missing audio stream as a malformed file rather than as silence. The
 * keyframe interval is pinned to two seconds because that is what the
 * transcoders on the other end expect.
 */
export async function renderLoop({
  basePlatePath,
  coverPlatePath,
  markPlatePath = null,
  outPath,
  size,
  seed,
}) {
  const { width, height } = size;
  const [base, cover, mark] = await Promise.all([
    loadImage(basePlatePath),
    loadImage(coverPlatePath),
    markPlatePath ? loadImage(markPlatePath) : Promise.resolve(null),
  ]);
  const markBounds = mark ? opaqueBounds(mark, width, height) : null;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  // Slices are torn from the composed frame, not from the plate, so a tear
  // catches the cover where the drift has actually put it.
  const scratch = createCanvas(width, height);
  const scratchCtx = scratch.getContext("2d");
  const scanlines = scanlineLayer(width, height);
  const bursts = scheduleBursts(makeRandom(seed));

  const ffmpeg = spawn("ffmpeg", [
    "-y",
    "-loglevel", "error",
    "-f", "rawvideo",
    "-pix_fmt", "bgra",
    "-s", `${width}x${height}`,
    "-r", String(MOTION.fps),
    "-i", "pipe:0",
    // Silent stereo track. anullsrc runs forever, so -shortest ends the file
    // with the video.
    "-f", "lavfi",
    "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.2",
    "-pix_fmt", "yuv420p",
    "-crf", "18",
    "-preset", "slow",
    "-g", String(MOTION.fps * 2),
    "-c:a", "aac",
    "-b:a", "128k",
    "-ar", "44100",
    "-ac", "2",
    "-shortest",
    "-movflags", "+faststart",
    outPath,
  ]);

  const finished = new Promise((resolve, reject) => {
    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`ffmpeg exited ${code}: ${stderr}`))
    );
  });

  for (let frame = 0; frame < TOTAL_FRAMES; frame += 1) {
    const burst = bursts.find((b) => frame >= b.start && frame < b.end);
    const drift = coverTransform(frame);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.drawImage(base, 0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + drift.x, height / 2 + drift.y);
    ctx.scale(drift.scale, drift.scale);
    ctx.drawImage(cover, -width / 2, -height / 2, width, height);
    ctx.restore();

    if (markBounds && markBounds.width > 0) {
      const revealed = Math.round(markBounds.width * markReveal(frame));
      if (revealed > 0) {
        ctx.drawImage(
          mark,
          markBounds.left, 0, revealed, height,
          markBounds.left, 0, revealed, height
        );
      }
    }

    if (burst) {
      ctx.drawImage(scanlines, 0, 0);
      if (burst.intensity > SLICE_THRESHOLD) {
        scratchCtx.clearRect(0, 0, width, height);
        scratchCtx.drawImage(canvas, 0, 0);
        paintSlices(ctx, burst, scratch, width, height);
      }
      paintBurst(ctx, burst, width, height);
    }

    await write(ffmpeg.stdin, frameBytes(canvas, width, height));
  }

  ffmpeg.stdin.end();
  await finished;

  return { frames: TOTAL_FRAMES, bursts: bursts.length };
}

export { GLITCH_COLORS };
