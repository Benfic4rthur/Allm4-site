import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import vm from 'node:vm';
import { buildPrimalith } from '../scripts/build-primalith.mjs';
import { selectReleaseAssets, formatBytes, LATEST_RELEASE_URL } from '../sites/primalith/source/releases.js';
import { games } from '../lib/games.ts';

const root = resolve(import.meta.dirname, '..');
const source = join(root, 'sites/primalith/source');
const target = mkdtempSync(join(tmpdir(), 'allm4-primalith-'));
buildPrimalith({ languageVersion: 'test', outputDirectory: target });
after(() => rmSync(target, { recursive: true, force: true }));
const html = readFileSync(join(target, 'index.html'), 'utf8');
const script = readFileSync(join(target, 'site.js'), 'utf8');

test('Games keeps Primalith and its original cover/icon outside the application catalog', () => {
  const primalith = games.find(game => game.slug === 'primalith');
  assert.ok(primalith);
  assert.equal(primalith.url, '/games/primalith/');
  assert.ok(primalith.description.length < 220);
  for (const field of ['image', 'icon']) {
    assert.ok(existsSync(join(target, primalith[field].replace('/games/primalith/', ''))));
  }
  for (const catalog of ['lib/products.ts', 'lib/extensions.ts']) {
    assert.doesNotMatch(readFileSync(join(root, catalog), 'utf8'), /primalith/i);
  }
});

test('the nested site is an independent document with native language controls and a Games return', () => {
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /href="https:\/\/allm4.com\/games\/primalith\/"/);
  assert.match(html, /href="\/games\/"/);
  assert.match(html, /data-allm4-language/);
  assert.match(html, /src="\/i18n\/standalone.js\?v=test"/);
  assert.doesNotMatch(html, /umbrella\.css|_next\/|<iframe|\/i18n\/language\.css/);
  // The control must be outside the collapsible mobile navigation.
  assert.ok(html.indexOf('data-allm4-language') < html.indexOf('class="menu-toggle"'));
});

test('all original visual assets and the release loader survive byte-for-byte', () => {
  for (const file of ['styles.css', 'releases.js', 'release-snapshot.json', ...readdirSync(join(source, 'assets'), { recursive: true }).filter(file => !['licenses'].includes(file)).map(file => 'assets/' + file)]) {
    if (!/\.[a-z0-9]+$/i.test(file)) continue;
    assert.deepEqual(readFileSync(join(target, file)), readFileSync(join(source, file)), file);
  }
});

test('relative images, videos, styles, scripts and fonts resolve at the nested route', () => {
  const paths = Array.from(html.matchAll(/(?:src|href|data-src)="(\.\/[^"#]+)"/g), match => match[1]);
  paths.push(...Array.from(readFileSync(join(target, 'styles.css'), 'utf8').matchAll(/url\(['"]?(\.\/[^)'" ]+)/g), match => match[1]));
  assert.ok(paths.length > 10);
  for (const path of paths) {
    const url = new URL(path, 'https://allm4.com/games/primalith/');
    assert.ok(url.pathname.startsWith('/games/primalith/'), path);
    assert.ok(existsSync(join(target, url.pathname.replace('/games/primalith/', ''))), path);
  }
});

const asset = name => ({ name, size: 80_000_000, browser_download_url: `https://github.com/Benfic4rthur/Primalith-Releases/releases/download/v9.4.7/${name}` });
const release = assets => ({ tag_name: 'v9.4.7', published_at: '2026-11-15T20:52:05Z', assets });
async function renderDownloads(value, source = 'live') {
  const nodes = new Map();
  const $ = selector => {
    if (!nodes.has(selector)) nodes.set(selector, { hidden: selector === '#download-mac' || selector === '#download-windows', firstChild: {}, classList: { remove() {} } });
    return nodes.get(selector);
  };
  const context = { $, storage: null, loadRelease: async () => ({ release: value, source }), selectReleaseAssets, formatBytes, LATEST_RELEASE_URL };
  const renderer = script.slice(script.indexOf('const result=await loadRelease'));
  await vm.runInNewContext(`(async () => {${renderer}\n})()`, context);
  return $;
}

test('the download UI only reveals platforms with a real installer and accepts future versions', async () => {
  assert.match(html, /id="download-mac" hidden/);
  assert.match(html, /id="download-windows" hidden/);
  for (const [assets, mac, windows] of [
    [[asset('Primalith-macOS.zip')], true, false],
    [[asset('Primalith-win-x64.exe')], false, true],
    [[asset('Primalith-macOS.dmg'), asset('Primalith-win-x64.exe')], true, true],
    [[asset('Primalith-desktop-update-mac.zip'), asset('primalith-web-update.zip')], false, false],
  ]) {
    const $ = await renderDownloads(release(assets));
    assert.equal($('#download-mac').hidden, !mac);
    assert.equal($('#download-windows').hidden, !windows);
    assert.equal($('#release-version').textContent, 'v9.4.7');
    if (mac) assert.ok(assets.some(asset => asset.browser_download_url === $('#mac-download-link').href));
    if (windows) assert.ok(assets.some(asset => asset.browser_download_url === $('#windows-download-link').href));
  }
});

test('download fallback stays usable and distinguishes verified offline data from a live check', async () => {
  const fallback = await renderDownloads(null, 'unavailable');
  assert.equal(fallback('#download-mac').hidden, true);
  assert.equal(fallback('#download-windows').hidden, true);
  assert.ok(fallback('#release-detail').innerHTML.includes(LATEST_RELEASE_URL));
  for (const origin of ['cache', 'snapshot']) {
    const cached = await renderDownloads(release([asset('Primalith-macOS.zip')]), origin);
    assert.equal(cached('#download-mac').hidden, false);
    assert.match(cached('#release-detail').textContent, /última versão verificada/);
  }
});
