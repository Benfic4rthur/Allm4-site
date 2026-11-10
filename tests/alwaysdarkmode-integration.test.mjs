import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { extensions } from '../lib/extensions.ts';

const root = resolve(import.meta.dirname, '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const site = 'public/alwaysdarkmode/';

test('Always Dark entra no catálogo compartilhado sem substituir as outras extensões', () => {
  const entry = extensions.find(extension => extension.slug === 'alwaysdarkmode');
  assert.equal(entry?.url, '/alwaysdarkmode/');
  assert.equal(entry?.icon, '/alwaysdarkmode/assets/always-dark.svg');
  assert.ok(existsSync(resolve(root, 'public' + entry.icon)));
  for (const slug of ['canalnongrato', 'tubeorder']) {
    assert.equal(extensions.find(extension => extension.slug === slug)?.url, `/${slug}/`);
  }
  assert.equal(new Set(extensions.map(extension => extension.slug)).size, extensions.length);
});

test('página independente preserva demonstração, assets e link permanente de download', () => {
  const html = read(site + 'index.html');
  const app = read(site + 'app.js');
  const download = 'https://github.com/Benfic4rthur/AlwaysDarkMode/releases/latest/download/Always-Dark.zip';
  const links = html.match(/<a\b[^>]*(?:data-download|class="dialog-download")[^>]*>/g);
  assert.equal(links.length, 5);
  for (const link of links) assert.ok(link.includes(`href="${download}"`));
  for (const example of ['study', 'news', 'work']) assert.ok(html.includes(`data-example="${example}"`));
  assert.ok(html.includes('id="demo-visible-toggle"'));
  assert.ok(app.includes("demo.dataset.mode = dark ? 'dark' : 'light'"));
  assert.ok(!app.includes('EventSource'));
  for (const match of html.matchAll(/(?:src|href)="((?:assets\/|styles\.css|app\.js)[^"]*)"/g)) {
    assert.ok(existsSync(resolve(root, site, match[1])), `Asset ausente: ${match[1]}`);
  }
  assert.ok(html.includes('rel="canonical" href="https://allm4.com/alwaysdarkmode/"'));
  assert.ok(html.includes('property="og:image" content="https://allm4.com/alwaysdarkmode/share.png"'));
  assert.ok(read('app/sitemap.ts').includes('https://allm4.com/alwaysdarkmode/'));
});
