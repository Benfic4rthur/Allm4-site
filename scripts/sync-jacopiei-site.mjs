import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import postcss from "postcss";

const sourceRepo = process.argv[2];
if (!sourceRepo) {
  throw new Error("Use: npm run sync:jacopiei -- /caminho/para/JáCopiei-SITE");
}

const source = resolve(sourceRepo, "dist");
const target = resolve("public/jacopiei");
const cssTarget = resolve("app/jacopiei/scoped.css");
for (const name of ["index.html", "style.css", "app.js", "release.js", "copy-demo.js", "config.js"]) {
  if (!existsSync(join(source, name))) {
    throw new Error(`O site de origem não contém dist/${name}`);
  }
}

function splitSelectors(value) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quote = "";
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (char === quote && value[index - 1] !== "\\") quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "(" || char === "[") {
      depth += 1;
    } else if (char === ")" || char === "]") {
      depth -= 1;
    } else if (char === "," && depth === 0) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(value.slice(start).trim());
  return parts;
}

function scopedCss(css) {
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
    rule.selector = splitSelectors(rule.selector)
      .map((selector) =>
        [":root", "body", "html"].includes(selector)
          ? ".jacopiei-site"
          : `.jacopiei-site ${selector}`,
      )
      .join(",");
  });
  root.append(
    postcss.rule({
      selector: ".jacopiei-site",
      nodes: [
        postcss.decl({ prop: "background", value: "#f5f3e9" }),
        postcss.decl({ prop: "color", value: "var(--ink)" }),
        postcss.decl({ prop: "min-height", value: "100vh" }),
        postcss.decl({ prop: "display", value: "flow-root" }),
      ],
    }),
  );
  return `/* Generated from JACOPIEI-SITE/dist/style.css. */\n${root.toString().trimEnd()}\n`;
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
writeFileSync(cssTarget, scopedCss(readFileSync(join(target, "style.css"), "utf8")));
console.log("JáCopiei-SITE sincronizado para /jacopiei/.");
