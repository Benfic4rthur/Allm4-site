import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const next = join(root, "node_modules", "next", "dist", "bin", "next");

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
  "local-ia/index.html",
  "jacopiei/index.html",
  "jacopiei/app.js",
  "jacopiei/assets/brand.svg",
]) {
  if (!existsSync(join(root, "out", file))) {
    throw new Error(`Exportação incompleta: out/${file} não foi gerado.`);
  }
}

console.log("Exportação estática completa em out/ (ALLM4 + JáCopiei?).");
