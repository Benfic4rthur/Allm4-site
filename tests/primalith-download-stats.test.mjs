import test from 'node:test';
import assert from 'node:assert/strict';
import { totalInstallerDownloads, fetchHistory, loadDownloadStats, HISTORY_API } from '../sites/primalith/download-stats.js';

const asset = (name, count, version = '1.3.9') => ({ name, state: 'uploaded', download_count: count, browser_download_url: `https://github.com/Benfic4rthur/Primalith-Releases/releases/download/v${version}/${name}` });
const release = (assets, extra = {}) => ({ draft: false, assets, ...extra });
const response = (body, link = null) => ({ ok: true, headers: { get: () => link }, json: async () => body });
const stats = (total, checkedAt = '2026-11-16T00:00:00Z') => ({ total, checkedAt, complete: true });
const now = () => Date.parse('2026-11-16T01:00:00Z');

test('sums every real installer across versions, original ArkCraft releases and public previews', () => {
  const mac = asset('Primalith-macOS.zip', 3);
  const history = [
    release([asset('ArkCraft-Stories-macOS.zip', 20, '1.0.1')]),
    release([mac, asset('Primalith-1.3.9-mac-universal.dmg', 4), asset('Primalith-1.3.9-win-x64.exe', 5)]),
    release([asset('Primalith-macOS.zip', 2, '2.0.0-beta.1')], { prerelease: true }),
    release([mac]),
    release([asset('Primalith-macOS.zip', 999, '9.0.0')], { draft: true }),
    release([asset('primalith-web-update.zip', 900), asset('primalith-desktop-update.zip', 800), asset('arkcraft-web-update.zip', 700), asset('Primalith-bootstrap.exe', 600)]),
    release([{ ...asset('Primalith-macOS.zip', 500), browser_download_url: 'https://example.com/Primalith-macOS.zip' }]),
  ];
  assert.equal(totalInstallerDownloads(history), 34);
});

test('rejects missing or invalid counts instead of presenting an incomplete sum', () => {
  for (const count of [null, undefined, -1, NaN, '12', 1.5]) {
    assert.throws(() => totalInstallerDownloads([release([asset('Primalith-macOS.zip', count)])]));
  }
  assert.throws(() => totalInstallerDownloads({ message: 'rate limit' }));
  assert.throws(() => totalInstallerDownloads([{}]));
});

test('continues past the first hundred releases and does not limit the total to latest', async () => {
  const first = Array.from({ length: 100 }, (_, i) => release([asset('Primalith-macOS.zip', 1, `1.0.${i}`)]));
  const calls = [];
  const history = await fetchHistory({ fetcher: async url => { calls.push(url); return response(url.endsWith('page=1') ? first : [release([asset('Primalith-win-x64.exe', 7, '0.1.0')])]); } });
  assert.equal(calls.length, 2);
  assert.equal(totalInstallerDownloads(history), 107);
  assert.ok(calls.every(url => url.startsWith(HISTORY_API)));
});

test('follows GitHub pagination links even when a page contains fewer than 100 entries', async () => {
  let calls = 0;
  const history = await fetchHistory({ fetcher: async () => ++calls === 1 ? response([release([])], '<https://api.github.com/next>; rel="next"') : response([release([])], '<https://api.github.com/prev>; rel="prev"') });
  assert.equal(calls, 2);
  assert.equal(history.length, 2);
});

test('a failed later page never publishes the partial first-page total', async () => {
  const result = await loadDownloadStats({ now, fetcher: async url => {
    if (url.endsWith('&page=1')) return response([release([asset('Primalith-macOS.zip', 3)])], '<https://api.github.com/next>; rel="next"');
    if (url.endsWith('&page=2')) throw Error('offline');
    return response(stats(42));
  } });
  assert.equal(result.total, 42);
  assert.equal(result.source, 'snapshot');
  assert.equal(result.stale, true);
});

test('fresh verified cache avoids additional API requests; stale cache is refreshed', async () => {
  const fresh = stats(25, '2026-11-16T00:59:00Z');
  const cached = await loadDownloadStats({ now, storage: { getItem: () => JSON.stringify(fresh) }, fetcher: () => { throw Error('should not request'); } });
  assert.equal(cached.total, 25);
  assert.equal(cached.stale, false);
  const updated = await loadDownloadStats({ now, storage: { getItem: () => JSON.stringify(stats(2)), setItem() {} }, fetcher: async () => response([release([asset('Primalith-win-x64.exe', 9)])]) });
  assert.equal(updated.total, 9);
  assert.equal(updated.source, 'live');
});

test('outages use the most recently verified complete total, never a fabricated zero', async () => {
  const old = stats(15), newer = stats(19, '2026-11-16T00:30:00Z');
  for (const [cache, snapshot, expected] of [[old, newer, 19], [newer, old, 19]]) {
    const result = await loadDownloadStats({ now, storage: { getItem: () => JSON.stringify(cache) }, fetcher: async url => { if (url.startsWith(HISTORY_API)) throw Error('offline'); return response(snapshot); } });
    assert.equal(result.total, expected);
    assert.equal(result.stale, true);
  }
  const unavailable = await loadDownloadStats({ now, fetcher: async () => { throw Error('offline'); } });
  assert.equal(unavailable.total, null);
  const empty = await loadDownloadStats({ now, fetcher: async () => response([]) });
  assert.equal(empty.total, 0);
  assert.equal(empty.source, 'live');
});

test('blocked storage and hung APIs do not break downloads or leave the counter pending', async () => {
  const live = await loadDownloadStats({ now, storage: { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } }, fetcher: async () => response([release([asset('Primalith-macOS.zip', 6)])]) });
  assert.equal(live.total, 6);
  const unavailable = await loadDownloadStats({ now, timeoutMs: 10, fetcher: async (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(Error('timeout')), { once: true })) });
  assert.equal(unavailable.total, null);
});
