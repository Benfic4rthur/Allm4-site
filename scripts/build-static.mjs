import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const next = join(root, "node_modules", "next", "dist", "bin", "next");
await import("./build-translations.mjs");

const gelamac = spawnSync(process.execPath, [join(root, "scripts/build-gelamac.mjs")], { cwd: root, stdio: "inherit" });
if (gelamac.error) throw gelamac.error;
if (gelamac.status !== 0) process.exit(gelamac.status ?? 1);

const build = spawnSync(process.execPath, [next, "build"], {
  cwd: root,
  env: {
    ...process.env,
    STATIC_EXPORT: "true",
    STATIC_BASE_PATH: "",
    NEXT_PUBLIC_BASE_PATH: "",
  },
  stdio: "inherit",
});

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

for (const file of [
  "index.html",
  "games/index.html",
  "games/fazuellipunk-2077/assets/cover.jpg",
  "games/fazuellipunk-2077/assets/icon.svg",
  "games/primalith/index.html",
  "games/primalith/site.js",
  "games/primalith/releases.js",
  "games/primalith/download-stats.js",
  "games/primalith/download-stats-snapshot.json",
  "games/primalith/release-snapshot.json",
  "games/primalith/assets/primalith-amber.svg",
  "games/primalith/assets/island-moon.mp4",
  "games/primalith/assets/island-tour.mp4",
  "trio/index.html",
  "trio/en/index.html",
  "trio/es/index.html",
  "trio/assets/site.js",
  "trio/assets/trio-icon.png",
  "trio/assets/fonts/LICENSE.txt",
  "trio/vendor/scrollcraft.js",
  "trio/share.png",
  "trio/downloads/Trio-macOS-universal.zip",
  "trio/downloads/Trio-macOS-universal.zip.sha256",
  "trio/downloads/release.json",
  "products/trio-icon.png",
  "gelamac/index.html",
  "gelamac/images/gelamac-icon.png",
  "gelamac/scrollcraft/scrollcraft.js",
  "gelamac/downloads/GelaMac-macOS-arm64.zip",
  "products/gelamac-icon.png",
  "local-ia/index.html",
  "beira/index.html",
  "products/beira-icon.svg",
  "codex-reset/index.html",
  "products/codex-reset-icon.png",
  "codex-reset/share.png",
  "jacopiei/index.html",
  "jacopiei/app.js",
  "jacopiei/assets/brand.svg",
  "canalnongrato/index.html",
  "canalnongrato/brand/canalnongrato.svg",
  "canalnongrato/share.png",
  "tubeorder/index.html",
  "tubeorder/brand/tubeorder.svg",
  "tubeorder/share.png",
  "alwaysdarkmode/index.html",
  "alwaysdarkmode/app.js",
  "alwaysdarkmode/releases.js",
  "alwaysdarkmode/styles.css",
  "alwaysdarkmode/assets/always-dark.svg",
  "alwaysdarkmode/assets/release.json",
  "alwaysdarkmode/share.png",
]) {
  if (!existsSync(join(root, "out", file))) {
    throw new Error(`Exportação incompleta: out/${file} não foi gerado.`);
  }
}

console.log("Exportação estática completa em out/ (ALLM4 + páginas dos produtos).");
