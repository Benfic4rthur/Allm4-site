import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "public/codex-reset/share.png");

// Keep the useful content inside x=150..1050 so WhatsApp's narrower preview
// crops only the background. All panel values below are illustrative.
const artwork = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="background" cx="83%" cy="53%" r="66%">
      <stop offset="0" stop-color="#17382e"/>
      <stop offset="0.55" stop-color="#101f19"/>
      <stop offset="1" stop-color="#0b1110"/>
    </radialGradient>
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#35524c"/>
      <stop offset="0.47" stop-color="#20392f"/>
      <stop offset="1" stop-color="#11221c"/>
    </linearGradient>
    <linearGradient id="mint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b0f6dd"/>
      <stop offset="1" stop-color="#72e7c7"/>
    </linearGradient>
    <linearGradient id="screen-glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-35%" y="-35%" width="170%" height="190%">
      <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#background)"/>
  <path d="M673 0h1v630h-1zM1120 0h1v630h-1z" fill="#b2edce" opacity="0.035"/>
  <text x="235" y="108" fill="#edf5ee" font-family="Arial,Helvetica,sans-serif" font-size="31" font-weight="600" letter-spacing="-1">Codex Reset</text>
  <text x="154" y="235" fill="#f1f7f1" font-family="Arial,Helvetica,sans-serif" font-size="67" font-weight="500" letter-spacing="-4">Seu Codex.</text>
  <text x="154" y="315" fill="url(#mint)" font-family="Arial,Helvetica,sans-serif" font-size="67" font-weight="500" letter-spacing="-4">Sempre à vista.</text>
  <text x="157" y="395" fill="#a9bdb0" font-family="Arial,Helvetica,sans-serif" font-size="19">Franquia, conversas e renovações</text>
  <text x="157" y="426" fill="#a9bdb0" font-family="Arial,Helvetica,sans-serif" font-size="19">no topo do Mac.</text>

  <g filter="url(#shadow)">
    <rect x="700" y="173" width="345" height="323" rx="19" fill="#0a1110" stroke="#5c8675" stroke-opacity="0.52"/>
    <rect x="706" y="179" width="333" height="311" rx="14" fill="url(#screen)"/>
    <path d="M706 193a14 14 0 0 1 14-14h305a14 14 0 0 1 14 14v12H706z" fill="#18271f" fill-opacity="0.7"/>
    <text x="717" y="195" fill="#bed2c5" font-family="Arial,Helvetica,sans-serif" font-size="8">Seu Mac</text>
    <text x="1005" y="195" fill="#bed2c5" font-family="Arial,Helvetica,sans-serif" font-size="8">10:24</text>
    <path d="M746 179h253v123c0 12-8 19-20 19H766c-12 0-20-7-20-19z" fill="#030605"/>
    <circle cx="771" cy="198" r="13" fill="none" stroke="#21463a" stroke-width="2.8"/>
    <circle cx="771" cy="198" r="13" fill="none" stroke="#72e7c7" stroke-width="2.8" stroke-linecap="round" stroke-dasharray="71 82" transform="rotate(-90 771 198)"/>
    <text x="762" y="201" fill="#eefbf4" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="700">87%</text>
    <circle cx="870" cy="198" r="2.3" fill="#132a31"/>
    <text x="919" y="193" fill="#e5eee8" font-family="Arial,Helvetica,sans-serif" font-size="7" font-weight="600">Seu projeto</text>
    <text x="919" y="205" fill="#8db49e" font-family="Arial,Helvetica,sans-serif" font-size="6">Modelo ativo</text>
    <path d="M984 190l3 3 3-3" fill="none" stroke="#b1c6ba" stroke-width="1"/>
    <path d="M761 231h223" stroke="#c3e2d2" stroke-opacity="0.1"/>
    <text x="778" y="249" fill="#8a9f93" font-family="Arial,Helvetica,sans-serif" font-size="6" letter-spacing="0.6">RESET EXTRA</text>
    <text x="778" y="265" fill="#e6f5eb" font-family="Arial,Helvetica,sans-serif" font-size="9">Entre 1d e 3d</text>
    <text x="778" y="278" fill="#7c9e8a" font-family="Arial,Helvetica,sans-serif" font-size="5.8">Estimativa histórica</text>
    <text x="891" y="249" fill="#8a9f93" font-family="Arial,Helvetica,sans-serif" font-size="6" letter-spacing="0.6">RESET SEMANAL</text>
    <text x="891" y="265" fill="#e6f5eb" font-family="Arial,Helvetica,sans-serif" font-size="9">Em 6d 17h</text>
    <text x="891" y="278" fill="#7c9e8a" font-family="Arial,Helvetica,sans-serif" font-size="5.8">Informado pelo Codex</text>
    <text x="818" y="301" fill="#9bb2a2" font-family="Arial,Helvetica,sans-serif" font-size="6.5">Último reset · há 6h</text>
    <path d="M739 367h146M739 383h201M739 399h174M739 415h113" stroke="#b8dbcb" stroke-width="3" stroke-linecap="round" stroke-opacity="0.13"/>
    <path d="M737 349h22" stroke="#72e7c7" stroke-width="3" stroke-linecap="round" stroke-opacity="0.7"/>
    <rect x="706" y="179" width="333" height="311" rx="14" fill="url(#screen-glass)"/>
  </g>
  <text x="789" y="524" fill="#8cac99" font-family="Arial,Helvetica,sans-serif" font-size="8" letter-spacing="1.8">PAINEL ILUSTRATIVO</text>
  <path d="M156 546h889" stroke="#afddc8" stroke-opacity="0.14"/>
  <text x="156" y="574" fill="#8faa97" font-family="Arial,Helvetica,sans-serif" font-size="10" letter-spacing="2">UM APLICATIVO ALLM4</text>
  <text x="858" y="574" fill="#8faa97" font-family="Arial,Helvetica,sans-serif" font-size="11">allm4.com/codex-reset</text>
</svg>`;

const icon = await sharp(await readFile(path.join(root, "public/products/codex-reset-icon.png")))
  .resize(78, 78, { fit: "contain" })
  .png()
  .toBuffer();

await mkdir(path.dirname(output), { recursive: true });
await sharp(Buffer.from(artwork))
  .composite([{ input: icon, left: 150, top: 58 }])
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(output);
