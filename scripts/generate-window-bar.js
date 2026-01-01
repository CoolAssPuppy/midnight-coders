const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

// Dimensions
const WIDTH = 800;
const HEIGHT = 40;
const PADDING_X = 16;
const PADDING_Y = 12;
const DOT_SIZE = 12;
const DOT_GAP = 8;

// Colors from the email template
const BG_COLOR = "#323233";
const DOT_RED = "#ff5f56";
const DOT_YELLOW = "#ffbd2e";
const DOT_GREEN = "#27c93f";
const TEXT_COLOR = "#808080";
const BORDER_COLOR = "rgba(255, 255, 255, 0.1)";

// Create canvas
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext("2d");

// Draw background
ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Draw bottom border
ctx.strokeStyle = BORDER_COLOR;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(0, HEIGHT - 0.5);
ctx.lineTo(WIDTH, HEIGHT - 0.5);
ctx.stroke();

// Calculate vertical center for dots
const centerY = HEIGHT / 2;

// Draw red dot
ctx.fillStyle = DOT_RED;
ctx.beginPath();
ctx.arc(PADDING_X + DOT_SIZE / 2, centerY, DOT_SIZE / 2, 0, Math.PI * 2);
ctx.fill();

// Draw yellow dot
ctx.fillStyle = DOT_YELLOW;
ctx.beginPath();
ctx.arc(PADDING_X + DOT_SIZE + DOT_GAP + DOT_SIZE / 2, centerY, DOT_SIZE / 2, 0, Math.PI * 2);
ctx.fill();

// Draw green dot
ctx.fillStyle = DOT_GREEN;
ctx.beginPath();
ctx.arc(PADDING_X + (DOT_SIZE + DOT_GAP) * 2 + DOT_SIZE / 2, centerY, DOT_SIZE / 2, 0, Math.PI * 2);
ctx.fill();

// Draw filename text
ctx.fillStyle = TEXT_COLOR;
ctx.font = "12px Menlo, Monaco, Consolas, monospace";
ctx.textBaseline = "middle";
const textX = PADDING_X + (DOT_SIZE + DOT_GAP) * 3 + 12;
ctx.fillText("midnight-coders-children.tsx", textX, centerY);

// Save to desktop
const desktopPath = path.join(process.env.HOME, "Desktop", "window-bar.png");
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(desktopPath, buffer);

console.log(`Image saved to: ${desktopPath}`);
