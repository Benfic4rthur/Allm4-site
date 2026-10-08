import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "public/images/allm4-share-v2.png");
const width = 1200;
const height = 630;

// WhatsApp crops the landscape Open Graph image for its side-by-side preview.
// Keep all text and product marks inside the central horizontal safe area.
const artwork = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="54%" r="63%">
      <stop offset="0" stop-color="#20204f"/>
      <stop offset="0.48" stop-color="#101126"/>
      <stop offset="1" stop-color="#080913"/>
    </radialGradient>
    <linearGradient id="headline" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.72" stop-color="#f7f5ff"/>
      <stop offset="1" stop-color="#b8a8ff"/>
    </linearGradient>
    <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="24"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="896" cy="315" r="157" fill="#5752d6" opacity="0.1" filter="url(#soft-glow)"/>
  <circle cx="896" cy="315" r="217" fill="none" stroke="#9692ea" stroke-opacity="0.13"/>
  <circle cx="896" cy="315" r="167" fill="none" stroke="#9692ea" stroke-opacity="0.12"/>
  <text x="154" y="365" fill="#ffffff" opacity="0.035" font-family="Arial,Helvetica,sans-serif" font-size="220" font-weight="700" letter-spacing="12">ALLM4</text>
  <text x="218" y="88" fill="#f5f5fb" font-family="Arial,Helvetica,sans-serif" font-size="31" font-weight="600" letter-spacing="8">ALLM4</text>
  <text x="220" y="110" fill="#9698af" font-family="Arial,Helvetica,sans-serif" font-size="9" letter-spacing="3">SOFTWARE FOR A BRIGHTER DAY</text>
  <path d="M156 166h28" stroke="#9582ff" stroke-width="2"/>
  <text x="198" y="170" fill="#a6a7bd" font-family="Arial,Helvetica,sans-serif" font-size="11" letter-spacing="3">SOFTWARE STUDIO</text>
  <text x="154" y="263" fill="url(#headline)" font-family="Arial,Helvetica,sans-serif" font-size="64" letter-spacing="-4">Software para</text>
  <text x="154" y="340" fill="url(#headline)" font-family="Arial,Helvetica,sans-serif" font-size="64" letter-spacing="-4">uma vida mais</text>
  <text x="154" y="417" fill="url(#headline)" font-family="Arial,Helvetica,sans-serif" font-size="64" letter-spacing="-4">simples.</text>
  <text x="157" y="481" fill="#b5b4c6" font-family="Arial,Helvetica,sans-serif" font-size="18">Aplicativos úteis, claros e bem construídos.</text>
  <path d="M155 546h468" stroke="#918fa8" stroke-opacity="0.22"/>
  <text x="155" y="570" fill="#7f819b" font-family="Arial,Helvetica,sans-serif" font-size="10" letter-spacing="2.5">APLICATIVOS · DESKTOP · EXPERIÊNCIAS DE SOFTWARE</text>
  <rect x="730" y="95" width="72" height="72" rx="22" fill="#171827" stroke="#5d5c83" stroke-opacity="0.65"/>
  <rect x="991" y="150" width="72" height="72" rx="22" fill="#171827" stroke="#5d5c83" stroke-opacity="0.65"/>
  <rect x="725" y="458" width="72" height="72" rx="22" fill="#171827" stroke="#5d5c83" stroke-opacity="0.65"/>
  <rect x="988" y="455" width="72" height="72" rx="22" fill="#171827" stroke="#5d5c83" stroke-opacity="0.65"/>
</svg>`;

const assets = [
  ["public/brand/allm4-mark.svg", 154, 55, 48],
  ["public/brand/allm4-mark.svg", 775, 186, 246],
  ["public/products/notchficator-icon.png", 737, 102, 58],
  ["public/products/lum4-icon.png", 998, 157, 58],
  ["public/products/jacopiei-icon.svg", 732, 465, 58],
  ["public/products/allm4-local-ia-icon.png", 995, 462, 58],
];

const overlays = await Promise.all(assets.map(async ([source, left, top, size]) => {
  const file = await readFile(path.join(root, source));
  // The official SVG wraps a WebP; extract it because libvips does not render
  // embedded WebP images inside SVGs consistently.
  const image = source.endsWith("allm4-mark.svg")
    ? Buffer.from(file.toString().match(/data:image\/webp;base64,([^\"]+)/)?.[1] ?? "", "base64")
    : file;
  return {
    input: await sharp(image)
      .resize(size, size, { fit: "contain" })
      .png()
      .toBuffer(),
    left,
    top,
  };
}));

await sharp(Buffer.from(artwork)).composite(overlays).png({ compressionLevel: 9 }).toFile(output);
console.log(output);
