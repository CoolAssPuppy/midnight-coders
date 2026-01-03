const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

// ICO file format helpers
function createIcoHeader(numImages) {
  const buffer = Buffer.alloc(6);
  buffer.writeUInt16LE(0, 0); // Reserved
  buffer.writeUInt16LE(1, 2); // ICO type
  buffer.writeUInt16LE(numImages, 4); // Number of images
  return buffer;
}

function createIcoEntry(width, height, offset, size) {
  const buffer = Buffer.alloc(16);
  buffer.writeUInt8(width === 256 ? 0 : width, 0);
  buffer.writeUInt8(height === 256 ? 0 : height, 1);
  buffer.writeUInt8(0, 2); // Color palette
  buffer.writeUInt8(0, 3); // Reserved
  buffer.writeUInt16LE(1, 4); // Color planes
  buffer.writeUInt16LE(32, 6); // Bits per pixel
  buffer.writeUInt32LE(size, 8); // Image size
  buffer.writeUInt32LE(offset, 12); // Offset
  return buffer;
}

function createFaviconImage(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, size, size);

  // Calculate font size proportionally
  const fontSize = Math.floor(size * 0.55);
  ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // Calculate positions for "0" and "1"
  const y = size / 2 + fontSize * 0.05;
  const spacing = fontSize * 0.35;

  // Draw "0" in yellow
  ctx.fillStyle = "#fcde09";
  ctx.fillText("0", size / 2 - spacing, y);

  // Draw "1" in white
  ctx.fillStyle = "#ffffff";
  ctx.fillText("1", size / 2 + spacing, y);

  return canvas;
}

function canvasToPngBuffer(canvas) {
  return canvas.toBuffer("image/png");
}

function generateIco(sizes) {
  const pngBuffers = sizes.map((size) => {
    const canvas = createFaviconImage(size);
    return canvasToPngBuffer(canvas);
  });

  const header = createIcoHeader(sizes.length);
  const entries = [];
  let offset = 6 + 16 * sizes.length;

  for (let i = 0; i < sizes.length; i++) {
    entries.push(createIcoEntry(sizes[i], sizes[i], offset, pngBuffers[i].length));
    offset += pngBuffers[i].length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

// Generate ICO with standard favicon sizes
const sizes = [16, 32, 48];
const icoBuffer = generateIco(sizes);

// Write to src/app/favicon.ico
const outputPath = path.join(__dirname, "..", "src", "app", "favicon.ico");
fs.writeFileSync(outputPath, icoBuffer);
console.log(`Generated favicon.ico at ${outputPath}`);

// Also generate individual PNG files for reference
const publicDir = path.join(__dirname, "..", "public");

sizes.forEach((size) => {
  const canvas = createFaviconImage(size);
  const pngPath = path.join(publicDir, `favicon-${size}x${size}.png`);
  fs.writeFileSync(pngPath, canvas.toBuffer("image/png"));
  console.log(`Generated ${pngPath}`);
});

// Generate larger sizes for apple-touch-icon
const appleCanvas = createFaviconImage(180);
fs.writeFileSync(
  path.join(publicDir, "apple-touch-icon.png"),
  appleCanvas.toBuffer("image/png")
);
console.log("Generated apple-touch-icon.png");

// Update SVG with Courier font explicitly
const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#121212"/>
  <text x="8" y="23" font-family="Courier New, Courier, monospace" font-size="18" font-weight="bold" fill="#fcde09">0</text>
  <text x="18" y="23" font-family="Courier New, Courier, monospace" font-size="18" font-weight="bold" fill="#ffffff">1</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, "favicon.svg"), svgContent);
console.log("Updated favicon.svg with Courier font");

console.log("\nFavicon generation complete!");
