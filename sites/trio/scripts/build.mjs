import { cp, copyFile, mkdir, readFile, readdir, rm, stat, access, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseBundledRelease, ASSET_NAME } from "../src/release.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(siteRoot, "dist");
const locales = { pt: { locale: "pt-BR", base: ".", directory: "" }, en: { locale: "en", base: "..", directory: "en" }, es: { locale: "es", base: "..", directory: "es" } };

async function exists(filename) {
  try { await access(filename); return true; } catch { return false; }
}

function leafKeys(value, prefix = "") {
  if (typeof value === "string") return [prefix];
  if (!value || typeof value !== "object") throw new Error(`Translation ${prefix || "root"} must contain strings`);
  return Object.entries(value).flatMap(([key, item]) => leafKeys(item, prefix ? `${prefix}.${key}` : key));
}

function validateTranslations(group, name) {
  if (!group || !["pt", "en", "es"].every(language => group[language])) throw new Error(`${name}: pt/en/es are required`);
  const expected = leafKeys(group.pt).sort();
  for (const language of Object.keys(locales)) {
    const actual = leafKeys(group[language]).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      const missing = expected.filter(key => !actual.includes(key));
      const extra = actual.filter(key => !expected.includes(key));
      throw new Error(`${name}.${language}: inconsistent keys; missing=${missing.join(",")}; extra=${extra.join(",")}`);
    }
  }
}

function html(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026").replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
}

function atPath(value, dotted) {
  return dotted.split(".").reduce((current, key) => {
    if (["__proto__", "constructor", "prototype"].includes(key) || !current || !Object.hasOwn(current, key)) return undefined;
    return current[key];
  }, value);
}

async function releaseFiles() {
  const candidates = [path.join(siteRoot, "distribution")];
  for (const directory of candidates) {
    const files = [ASSET_NAME, `${ASSET_NAME}.sha256`, "release.json"];
    if (!(await Promise.all(files.map(file => exists(path.join(directory, file))))).every(Boolean)) continue;
    const metadata = JSON.parse(await readFile(path.join(directory, "release.json"), "utf8"));
    parseBundledRelease(metadata, { base: "." });
    const zip = await readFile(path.join(directory, ASSET_NAME));
    const digest = createHash("sha256").update(zip).digest("hex");
    const checksum = (await readFile(path.join(directory, `${ASSET_NAME}.sha256`), "utf8")).trim().split(/\s+/);
    if (metadata.sha256 !== digest || metadata.size !== zip.length || checksum[0] !== digest || checksum[1]?.replace(/^\*/, "") !== ASSET_NAME) {
      throw new Error("Bundled ZIP, release.json and checksum do not match");
    }
    return { directory, metadata, files };
  }
  throw new Error("No verified Trio package found in sites/trio/distribution.");
}

const { content, runtimeCopy } = await import(path.join(siteRoot, "content.mjs"));
validateTranslations(content, "content");
validateTranslations(runtimeCopy, "runtimeCopy");
const template = await readFile(path.join(siteRoot, "index.template.html"), "utf8");
const release = await releaseFiles();
// Check the three owned runtime files before replacing a previous build.
for (const file of ["styles.css", "src/site.js", "src/release.mjs"]) await stat(path.join(siteRoot, file));

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "assets"), { recursive: true });
if (await exists(path.join(siteRoot, "public"))) await cp(path.join(siteRoot, "public"), dist, { recursive: true });
await copyFile(path.join(siteRoot, "styles.css"), path.join(dist, "assets/styles.css"));
await copyFile(path.join(siteRoot, "src/site.js"), path.join(dist, "assets/site.js"));
await copyFile(path.join(siteRoot, "src/release.mjs"), path.join(dist, "assets/release.mjs"));
await copyFile(path.join(siteRoot, "public/assets/trio-icon.png"), path.join(dist, "assets/trio-icon.png"));
await copyFile(path.join(siteRoot, "src/language.mjs"), path.join(dist, "assets/language.mjs"));

const localFonts = path.join(siteRoot, "public/fonts");
const fontSource = localFonts;
await mkdir(path.join(dist, "assets/fonts"), { recursive: true });
for (const filename of await readdir(fontSource)) {
  if (/\.(ttf|woff2?|otf)$/i.test(filename) || /^LICENSE(?:\.|$)/i.test(filename)) {
    await copyFile(path.join(fontSource, filename), path.join(dist, "assets/fonts", filename));
  }
}

await mkdir(path.join(dist, "vendor"), { recursive: true });
for (const filename of ["scrollcraft.js", "scrollcraft.css"]) {
  const bundled = path.join(siteRoot, "public/vendor", filename);
  const source = bundled;
  await copyFile(source, path.join(dist, "vendor", filename));
}
await mkdir(path.join(dist, "downloads"), { recursive: true });
for (const filename of release.files) await copyFile(path.join(release.directory, filename), path.join(dist, "downloads", filename));

for (const [language, config] of Object.entries(locales)) {
  const canonical = `https://allm4.com/trio/${config.directory ? `${config.directory}/` : ""}`;
  const back = { pt: "Voltar ao ALLM4", en: "Back to ALLM4", es: "Volver a ALLM4" };
  const data = { ...content[language], ...config, language, canonical, allm4: { back: back[language], href: `/?lang=${language}` }, version: release.metadata.version, build: release.metadata.build };
  data.runtimeJson = safeJson({ language, locale: config.locale, base: config.base, copy: runtimeCopy[language], release: release.metadata });
  const output = template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const value = atPath(data, key);
    if (typeof value !== "string" && typeof value !== "number") throw new Error(`Missing template key ${language}.${key}`);
    return key === "runtimeJson" ? value : html(value);
  });
  if (output.includes("{{")) throw new Error(`Unresolved template token in ${language}`);
  const directory = path.join(dist, config.directory);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), output);
}
console.log(`Built Trio site: pt/en/es, app ${release.metadata.version} (${release.metadata.build}), verified ZIP ${release.metadata.sha256}`);
