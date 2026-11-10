import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "public/canalnongrato/share.png");
const mark = await readFile(path.join(root, "public/canalnongrato/brand/canalnongrato.svg"));
const markUrl = `data:image/svg+xml;base64,${mark.toString("base64")}`;

const artwork = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="warm"><stop stop-color="#e98b70" stop-opacity=".12"/><stop offset="1" stop-color="#101820" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#101820"/>
  <ellipse cx="929" cy="320" rx="310" ry="300" fill="url(#warm)"/>
  <image href="${markUrl}" x="100" y="64" width="48" height="48"/>
  <text x="164" y="96" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="600" letter-spacing="-1" fill="#f2f0eb">Canal<tspan fill="#e98b70">NonGrato</tspan></text>
  <text x="100" y="262" font-family="Arial,Helvetica,sans-serif" font-size="91" font-weight="600" letter-spacing="-6" fill="#f2f0eb">Seu feed.</text>
  <text x="100" y="357" font-family="Georgia,Times New Roman,serif" font-style="italic" font-size="96" letter-spacing="-6" fill="#e98b70">Suas regras.</text>
  <text x="104" y="421" font-family="Arial,Helvetica,sans-serif" font-size="21" fill="#a8b5c0">Bloqueie canais indesejados no YouTube.</text>
  <text x="104" y="456" font-family="Arial,Helvetica,sans-serif" font-size="17" fill="#a8b5c0">Gratuito para Edge e Chrome no computador.</text>
  <g transform="rotate(7 916 299)">
    <rect x="791" y="174" width="250" height="250" rx="60" fill="#17212c" stroke="#e98b7025"/>
    <image href="${markUrl}" x="821" y="204" width="190" height="190"/>
  </g>
  <path d="M100 534h1000" stroke="#ffffff1a"/>
  <text x="104" y="572" font-family="Arial,Helvetica,sans-serif" font-size="12" letter-spacing="2" fill="#9aa8b5">UMA EXTENSÃO ALLM4</text>
  <text x="823" y="572" font-family="Arial,Helvetica,sans-serif" font-size="14" fill="#9aa8b5">allm4.com/canalnongrato</text>
</svg>`;

await sharp(Buffer.from(artwork)).png({ compressionLevel: 9 }).toFile(output);
console.log(output);
