import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const sourceRepo = process.argv[2];
if (!sourceRepo) {
  throw new Error("Use: npm run sync:jacopiei -- /caminho/para/JáCopiei-SITE");
}

const source = resolve(sourceRepo, "dist");
const target = resolve("public/jacopiei");
for (const name of ["index.html", "style.css", "app.js", "release.js", "copy-demo.js", "config.js"]) {
  if (!existsSync(join(source, name))) {
    throw new Error(`O site de origem não contém dist/${name}`);
  }
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });

const oldSiteUrl = "https://jacopiei.arthur-benfica.chatgpt.site";
const newSiteUrl = "https://allm4.com/jacopiei";
for (const name of ["index.html", "config.js"]) {
  const path = join(target, name);
  const original = readFileSync(path, "utf8");
  if (!original.includes(oldSiteUrl)) {
    throw new Error(`URL de origem não encontrada em ${name}; revise a migração.`);
  }
  writeFileSync(path, original.replaceAll(oldSiteUrl, newSiteUrl));
}
console.log("JáCopiei-SITE sincronizado para /jacopiei/.");
