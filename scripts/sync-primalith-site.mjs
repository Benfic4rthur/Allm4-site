import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = process.argv[2];
if (!input) throw new Error("Use: npm run sync:primalith -- /path/to/Primalith-site/dist");
const source = resolve(input);
for (const file of ["index.html", "styles.css", "site.js", "releases.js", "release-snapshot.json", "assets/primalith-amber.svg"]) {
  if (!existsSync(join(source, file))) throw new Error(`Incomplete Primalith export: ${file}`);
}
const target = join(root, "sites/primalith/source");
if (source === target || target.startsWith(source + "/")) throw new Error("Choose the external prepared export directory.");
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log("Primalith website snapshot synchronized. The original website and the game were not modified.");
