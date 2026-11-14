import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'sites/trio');
const temporary = await mkdtemp(path.join(tmpdir(), 'allm4-trio-clean-'));
after(() => rm(temporary, { recursive: true, force: true }));
const clone = path.join(temporary, 'trio');
await cp(source, clone, { recursive: true, filter: filename => !['dist', 'node_modules'].includes(path.basename(filename)) });
const build = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: clone, encoding: 'utf8' });
const output = path.join(clone, 'dist');

test('a clean portable source builds without another checkout or installed site dependencies', () => {
  assert.equal(build.status, 0, build.stderr || build.stdout);
  const builder = path.join(source, 'scripts/build.mjs');
  return readFile(builder, 'utf8').then(text => assert.doesNotMatch(text, /\/Users\/|\.agents\/skills|projectRoot/));
});

test('all three documents have local assets, canonical metadata, one selector and an ALLM4 return', async () => {
  for (const [directory, locale, prefix] of [['', 'pt-BR', '.'], ['en', 'en', '..'], ['es', 'es', '..']]) {
    const html = await readFile(path.join(output, directory, 'index.html'), 'utf8');
    assert.ok(html.includes(`<html lang="${locale}">`));
    assert.ok(html.includes(`rel="canonical" href="https://allm4.com/trio/${directory ? `${directory}/` : ''}"`));
    assert.ok(html.includes('https://allm4.com/trio/share.png'));
    assert.equal((html.match(/class="languages"/g) || []).length, 1);
    assert.doesNotMatch(html, /\/i18n\/standalone\.js|\{\{/);
    assert.ok(html.includes('class="allm4-back" href="/?lang='));
    assert.ok(html.includes(`src="${prefix}/assets/site.js"`));
    assert.ok(html.includes(`href="${prefix}/downloads/Trio-macOS-universal.zip"`));
    for (const match of html.matchAll(/(?:src|href)="((?:\.|\.\.)\/[^"#]+)"/g)) {
      const filename = path.resolve(output, directory, match[1]);
      assert.ok(filename.startsWith(`${output}${path.sep}`), `Escaped static site: ${match[1]}`);
      await stat(filename);
    }
  }
});

test('the bundled real package matches size, checksum and advertised runtime metadata', async () => {
  const metadata = JSON.parse(await readFile(path.join(output, 'downloads/release.json'), 'utf8'));
  const archive = await readFile(path.join(output, 'downloads/Trio-macOS-universal.zip'));
  const checksum = await readFile(path.join(output, 'downloads/Trio-macOS-universal.zip.sha256'), 'utf8');
  const digest = createHash('sha256').update(archive).digest('hex');
  assert.equal(digest, metadata.sha256);
  assert.equal(archive.length, metadata.size);
  assert.ok(checksum.startsWith(`${digest}  Trio-macOS-universal.zip`));
  const html = await readFile(path.join(output, 'index.html'), 'utf8');
  const runtime = JSON.parse(html.match(/id="trio-runtime">([\s\S]*?)<\/script>/)[1]);
  assert.equal(runtime.release.sha256, digest);
  assert.equal(runtime.release.version, metadata.version);
  assert.equal(runtime.release.build, metadata.build);
  assert.equal(metadata.notarized, false);
});

test('share image and icon are local approved raster assets with expected dimensions', async () => {
  const image = await readFile(path.join(output, 'share.png'));
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  const approved = await readFile(path.join(source, 'public/assets/trio-icon.png'));
  const exported = await readFile(path.join(output, 'assets/trio-icon.png'));
  assert.deepEqual(exported, approved);
});
