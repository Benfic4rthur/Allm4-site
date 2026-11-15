export const RELEASES_URL = 'https://github.com/Benfic4rthur/Primalith-Releases/releases';
export const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`;
export const RELEASE_API_URL = 'https://api.github.com/repos/Benfic4rthur/Primalith-Releases/releases/latest';
export const RELEASE_SNAPSHOT_URL = new URL('./release-snapshot.json', import.meta.url).href;
const ASSET_PREFIX = 'https://github.com/Benfic4rthur/Primalith-Releases/releases/download/';
const CACHE_KEY = 'primalith_site_verified_release_v1';

function officialAsset(asset) {
  if (!asset || typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string') return false;
  try {
    const url = new URL(asset.browser_download_url);
    return url.href.startsWith(ASSET_PREFIX) && !url.username && !url.password && !url.search && !url.hash;
  } catch { return false; }
}

/** Never advertise update payload ZIPs as installers, or invent a missing platform. */
export function selectReleaseAssets(release) {
  const assets = Array.isArray(release?.assets) ? release.assets.filter(officialAsset) : [];
  const installers = assets.filter(asset => !/(?:web|desktop)[-_ ]?update|blockmap|bootstrap/i.test(asset.name));
  const mac = installers.filter(asset => /^primalith/i.test(asset.name) && /(?:mac|darwin|osx)/i.test(asset.name) && /\.(?:dmg|zip)$/i.test(asset.name))
    .sort((a,b) => Number(/\.dmg$/i.test(b.name)) - Number(/\.dmg$/i.test(a.name)))[0] ?? null;
  const windows = installers.find(asset => /^primalith/i.test(asset.name) && /\.exe$/i.test(asset.name)) ?? null;
  return {mac, windows};
}

export function validRelease(value) {
  return Boolean(value && typeof value.tag_name === 'string' && /^v?\d+\.\d+\.\d+(?:\+[\w.-]+)?$/.test(value.tag_name) &&
    !value.draft && !value.prerelease && Array.isArray(value.assets));
}

function newerFallback(cache, snapshot) {
  if (!cache) return snapshot;
  if (!snapshot) return cache;
  const parts = value => value.release.tag_name.replace(/^v/, '').split('+')[0].split('.').map(Number);
  const cachedVersion = parts(cache), snapshotVersion = parts(snapshot);
  for (let i = 0; i < 3; i++) {
    if (cachedVersion[i] !== snapshotVersion[i]) return cachedVersion[i] > snapshotVersion[i] ? cache : snapshot;
  }
  const date = value => {
    const checked = Date.parse(value.checkedAt);
    const published = Date.parse(value.release.published_at);
    return Number.isFinite(checked) ? checked : Number.isFinite(published) ? published : 0;
  };
  // A refreshed deployment may add an installer to the same release. On an exact
  // tie prefer its snapshot rather than pinning that visitor's older asset list.
  return date(cache) > date(snapshot) ? cache : snapshot;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  return bytes >= 1_000_000_000 ? `${(bytes/1_000_000_000).toFixed(1).replace('.',',')} GB` : `${Math.round(bytes/1_000_000)} MB`;
}

export async function loadRelease({fetcher = fetch, storage = null, timeoutMs = 6500} = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(RELEASE_API_URL, {signal:controller.signal, headers:{Accept:'application/vnd.github+json'}, cache:'no-cache'});
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const release = await response.json();
    if (!validRelease(release)) throw new Error('Resposta de versão inválida');
    const snapshot = {release, checkedAt:new Date().toISOString()};
    try {storage?.setItem(CACHE_KEY, JSON.stringify(snapshot));} catch {}
    return {...snapshot, source:'live'};
  } catch {
    let cached = null;
    try {
      const value = JSON.parse(storage?.getItem(CACHE_KEY) || 'null');
      if (validRelease(value?.release)) cached = {...value, source:'cache'};
    } catch {}
    let snapshot = null;
    const snapshotController = new AbortController();
    const snapshotTimer = setTimeout(() => snapshotController.abort(), Math.min(timeoutMs, 2500));
    try {
      const response = await fetcher(RELEASE_SNAPSHOT_URL, {cache:'no-cache', signal:snapshotController.signal});
      const value = response.ok ? await response.json() : null;
      if (validRelease(value?.release)) snapshot = {...value, source:'snapshot'};
    } catch {} finally {clearTimeout(snapshotTimer);}
    const chosen = newerFallback(cached, snapshot);
    if (chosen) {
      if (chosen.source === 'snapshot') {
        try {storage?.setItem(CACHE_KEY, JSON.stringify({release:chosen.release, checkedAt:chosen.checkedAt}));} catch {}
      }
      return chosen;
    }
    return {release:null, checkedAt:null, source:'unavailable'};
  } finally {clearTimeout(timer);}
}
