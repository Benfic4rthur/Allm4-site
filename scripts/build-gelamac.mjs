import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "sites/gelamac");
const result = spawnSync(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
  cwd: source,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
if (!existsSync(join(source, "out/index.html"))) throw new Error("Exportação do GelaMac incompleta.");
// Separate HTML document, like JáCopiei: no iframe and no CSS shared with ALLM4.
const destination = join(root, "public/gelamac");
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(join(source, "out"), destination, { recursive: true });
console.log("GelaMac integrado em public/gelamac/ com recursos sob /gelamac/.");
