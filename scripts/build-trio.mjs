import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'sites/trio');
const result = spawnSync(process.execPath, [join(source, 'scripts/build.mjs')], { cwd: source, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
for (const file of ['index.html', 'en/index.html', 'es/index.html', 'share.png', 'downloads/Trio-macOS-universal.zip']) {
  if (!existsSync(join(source, 'dist', file))) throw new Error(`Trio export is missing ${file}`);
}
const destination = join(root, 'public/trio');
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(join(source, 'dist'), destination, { recursive: true });
console.log('Trio exported to public/trio/ with its verified Universal download.');
