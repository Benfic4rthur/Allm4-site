import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function buildPrimalith({ languageVersion, outputDirectory } = {}) {
  const source = join(root, "sites/primalith/source");
  const target = outputDirectory ?? join(root, "public/games/primalith");
  for (const file of ["index.html", "site.js", "styles.css", "releases.js", "release-snapshot.json", "assets/primalith-amber.svg", "assets/hero-moon.jpg", "assets/island-moon.mp4", "assets/island-tour.mp4"]) {
    if (!existsSync(join(source, file))) throw new Error(`Primalith source is missing ${file}. Run sync:primalith with the prepared website dist directory.`);
  }
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });

  // Original styles, photos, videos, icon and release parser remain unmodified.
  let html = readFileSync(join(source, "index.html"), "utf8");
  let site = readFileSync(join(source, "site.js"), "utf8");
  // Native mobile styles hide some line breaks; keep words separated there.
  html = html.replaceAll("<br>", "<br> ");
  if (!site.includes("if(mac){")) throw new Error("Review Primalith's installer adapter: its upstream download renderer changed.");
  site = site.replace("if(mac){", "if(mac){\n    $('#download-mac').hidden=false;");
  html = html.replace('id="download-mac"', 'id="download-mac" hidden');
  html = html.replace('content="./assets/hero-moon.jpg?v=moon3"', 'content="https://allm4.com/games/primalith/assets/hero-moon.jpg?v=moon3"');
  html = html.replace("</head>", `<link rel="canonical" href="https://allm4.com/games/primalith/">\n  <meta property="og:url" content="https://allm4.com/games/primalith/">\n  <link rel="stylesheet" href="./allm4-integration.css">\n  <script defer src="/i18n/translations.js?v=${languageVersion ?? "primalith"}"></script>\n  <script defer src="/i18n/standalone.js?v=${languageVersion ?? "primalith"}"></script>\n</head>`);
  html = html.replace('    <button class="menu-toggle"', '    <div class="primalith-language-switcher" data-allm4-language aria-label="Language / Idioma"></div>\n    <button class="menu-toggle"');
  html = html.replace("    </nav>", '      <a class="allm4-games-return" href="/games/">← Games ALLM4</a>\n    </nav>');
  const version = createHash("sha256").update(site).update(readFileSync(join(root, "sites/primalith/integration.css"))).digest("hex").slice(0, 12);
  html = html.replace('src="./site.js"', `src="./site.js?v=${version}"`).replace('href="./allm4-integration.css"', `href="./allm4-integration.css?v=${version}"`);
  writeFileSync(join(target, "index.html"), html);
  writeFileSync(join(target, "site.js"), site);
  cpSync(join(root, "sites/primalith/integration.css"), join(target, "allm4-integration.css"));
  console.log("Primalith integrated at /games/primalith/ with its original independent document.");
}
