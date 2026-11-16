export const HISTORY_API = 'https://api.github.com/repos/Benfic4rthur/Primalith-Releases/releases';
export const STATS_CACHE_KEY = 'primalith_total_installer_downloads_v1';
const assetPrefix = 'https://github.com/Benfic4rthur/Primalith-Releases/releases/download/';
const snapshotUrl = new URL('./download-stats-snapshot.json', import.meta.url);
snapshotUrl.search = new URL(import.meta.url).search;

export function isInstaller(asset) {
  if (!asset || asset.state !== 'uploaded' || typeof asset.name !== 'string') return false;
  const name = asset.name;
  // ArkCraft is the original name used by this same game's older releases.
  if (!/^(?:primalith|arkcraft)(?:[-_. ]|$)/i.test(name) || /update|blockmap|bootstrap/i.test(name)) return false;
  if (!(/\.(?:exe|msi)$/i.test(name) || /(?:mac|darwin|osx).*\.(?:dmg|zip)$/i.test(name))) return false;
  try {
    const url = new URL(asset.browser_download_url);
    return url.href.startsWith(assetPrefix) && !url.username && !url.password && !url.search && !url.hash &&
      decodeURIComponent(url.pathname.split('/').pop()) === name;
  } catch { return false; }
}

export function totalInstallerDownloads(releases) {
  if (!Array.isArray(releases)) throw new Error('Invalid release history');
  let total = 0;
  const seen = new Set();
  for (const release of releases) {
    if (!release || !Array.isArray(release.assets)) throw new Error('Incomplete release history');
    if (release.draft) continue;
    for (const asset of release.assets) {
      if (!isInstaller(asset)) continue;
      const id = asset.id ?? asset.browser_download_url;
      if (seen.has(id)) continue;
      seen.add(id);
      if (!Number.isSafeInteger(asset.download_count) || asset.download_count < 0) throw new Error('Invalid download count');
      total += asset.download_count;
      if (!Number.isSafeInteger(total)) throw new Error('Invalid download total');
    }
  }
  return total;
}

export async function fetchHistory({ fetcher = fetch, timeoutMs = 6500 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const releases = [];
  try {
    for (let page = 1; ; page++) {
      const response = await fetcher(`${HISTORY_API}?per_page=100&page=${page}`, {
        signal: controller.signal, headers: { Accept: 'application/vnd.github+json' }, cache: 'no-cache',
      });
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const entries = await response.json();
      if (!Array.isArray(entries)) throw new Error('Invalid release history');
      releases.push(...entries);
      const link = response.headers?.get('link');
      if (link ? !/rel="next"/.test(link) : entries.length < 100) return releases;
    }
  } finally { clearTimeout(timer); }
}

function validStats(value) {
  return value?.complete === true && Number.isSafeInteger(value.total) && value.total >= 0 &&
    typeof value.checkedAt === 'string' && Number.isFinite(Date.parse(value.checkedAt));
}

export async function loadDownloadStats({ fetcher = fetch, storage = null, now = Date.now, timeoutMs = 6500 } = {}) {
  let cached = null;
  try { const value = JSON.parse(storage?.getItem(STATS_CACHE_KEY) || 'null'); if (validStats(value)) cached = value; } catch {}
  const age = cached ? now() - Date.parse(cached.checkedAt) : Infinity;
  if (age >= 0 && age < 300_000) return { ...cached, source: 'cache', stale: false };
  try {
    const history = await fetchHistory({ fetcher, timeoutMs });
    const stats = { total: totalInstallerDownloads(history), checkedAt: new Date(now()).toISOString(), complete: true };
    try { storage?.setItem(STATS_CACHE_KEY, JSON.stringify(stats)); } catch {}
    return { ...stats, source: 'live', stale: false };
  } catch {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(timeoutMs, 2500));
    let snapshot = null;
    try {
      const response = await fetcher(snapshotUrl.href, { signal: controller.signal, cache: 'no-cache' });
      const value = response.ok ? await response.json() : null;
      if (validStats(value)) snapshot = value;
    } catch {} finally { clearTimeout(timer); }
    const useCache = cached && (!snapshot || Date.parse(cached.checkedAt) > Date.parse(snapshot.checkedAt));
    const fallback = useCache ? cached : snapshot;
    return fallback ? { ...fallback, source: useCache ? 'cache' : 'snapshot', stale: true } : { total: null, source: 'unavailable', stale: true };
  }
}

if (typeof document !== 'undefined' && document.querySelector('#total-downloads-value')) {
  const number = document.querySelector('#total-downloads-value');
  const status = document.querySelector('#total-downloads-status');
  let storage = null;
  try { storage = localStorage; } catch {}
  void loadDownloadStats({ storage }).then(stats => {
    const renderNumber = () => { number.textContent = stats.total === null ? '—' : new Intl.NumberFormat(document.documentElement.lang || 'pt-BR').format(stats.total); };
    renderNumber();
    status.textContent = stats.total === null ? 'Não foi possível consultar o total agora.' : stats.stale ?
      'Último total verificado no GitHub. A consulta está temporariamente indisponível.' :
      'Instaladores de todas as versões, somados no GitHub.';
    if (stats.checkedAt) number.title = new Date(stats.checkedAt).toLocaleString(document.documentElement.lang || 'pt-BR');
    new MutationObserver(renderNumber).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
}
