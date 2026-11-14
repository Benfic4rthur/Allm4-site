export const ASSET_NAME = "Trio-macOS-universal.zip";
export const GITHUB_API_URL = "https://api.github.com/repos/Benfic4rthur/Trio/releases/latest";
export const PUBLIC_DISTRIBUTION_URL = "https://raw.githubusercontent.com/Benfic4rthur/Trio/main/distribution/release.json";
export const PUBLIC_DOWNLOAD_URL = "https://raw.githubusercontent.com/Benfic4rthur/Trio/main/distribution/Trio-macOS-universal.zip";
const GITHUB_REPO_URL = "https://github.com/Benfic4rthur/Trio";
const SHA256 = /^[a-f0-9]{64}$/i;

function versionFromTag(tag) {
  if (typeof tag !== "string" || tag.length > 120) throw new Error("Invalid release version");
  const match = /^v?((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?)$/.exec(tag);
  if (!match || match[2]?.split(".").some(part => /^\d+$/.test(part) && part.length > 1 && part[0] === "0")) {
    throw new Error("Invalid semantic release version");
  }
  return match[1];
}

function positiveSize(size) {
  if (!Number.isSafeInteger(size) || size <= 0) throw new Error("Invalid release asset size");
  return size;
}

function trustedAsset(asset, tag, name) {
  if (!asset || asset.name !== name || asset.state !== "uploaded") throw new Error("Release asset is unavailable");
  const url = new URL(asset.browser_download_url);
  const expectedPath = `/Benfic4rthur/Trio/releases/download/${tag}/${name}`;
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.port || url.username || url.password ||
      url.search || url.hash || decodeURIComponent(url.pathname) !== expectedPath) {
    throw new Error("Untrusted release asset URL");
  }
  positiveSize(asset.size);
  return `${GITHUB_REPO_URL}/releases/download/${encodeURIComponent(tag)}/${name}`;
}

/** Parse only a stable release from this repository. No URL from the API is returned unchecked. */
export function parseRelease(data) {
  if (!data || data.draft !== false || data.prerelease !== false || !Array.isArray(data.assets)) {
    throw new Error("Not a stable published release");
  }
  const version = versionFromTag(data.tag_name);
  const assets = data.assets.filter(asset => asset?.name === ASSET_NAME);
  if (assets.length !== 1) throw new Error("Expected one Universal Trio asset");
  const asset = assets[0];
  const taggedUrl = trustedAsset(asset, data.tag_name, ASSET_NAME);
  const checksumAssets = data.assets.filter(item => item?.name === `${ASSET_NAME}.sha256`);
  if (checksumAssets.length > 1) throw new Error("Ambiguous checksum asset");
  const checksumUrl = checksumAssets.length ? trustedAsset(checksumAssets[0], data.tag_name, `${ASSET_NAME}.sha256`) : null;
  let sha256 = null;
  if (asset.digest != null) {
    const digest = /^sha256:([a-f0-9]{64})$/i.exec(asset.digest);
    if (!digest) throw new Error("Invalid release digest");
    sha256 = digest[1].toLowerCase();
  }
  const url = `${GITHUB_REPO_URL}/releases/latest/download/${ASSET_NAME}`;
  return {
    version, build: null, tag: data.tag_name, assetName: ASSET_NAME,
    url, downloadUrl: url, taggedUrl, checksumUrl, sha256, size: positiveSize(asset.size),
    source: "github", publicRelease: true, publicDownload: true, notarized: null,
    releaseUrl: `${GITHUB_REPO_URL}/releases/tag/${encodeURIComponent(data.tag_name)}`
  };
}

function localDownloads(base) {
  if (base === "." || base === "..") return `${base}/downloads/`;
  if (base !== undefined) throw new Error("Invalid local download base");
  // This module is always shipped at /assets/release.mjs, shared by all locales.
  return new URL("../downloads/", import.meta.url).href;
}

/** Metadata must describe the actual ZIP copied by the local build. */
export function parseBundledRelease(data, { base } = {}) {
  if (!data || data.bundleIdentifier !== "com.allm4.Trio" || data.assetName !== ASSET_NAME ||
      !SHA256.test(data.sha256 ?? "") || !/^\d+$/.test(String(data.build ?? "")) ||
      !Array.isArray(data.architectures) || !data.architectures.includes("arm64") || !data.architectures.includes("x86_64")) {
    throw new Error("Invalid bundled release metadata");
  }
  const version = versionFromTag(data.version);
  const downloads = localDownloads(base);
  const url = `${downloads}${ASSET_NAME}`;
  return {
    ...data, version, build: String(data.build), sha256: data.sha256.toLowerCase(),
    size: positiveSize(data.size), source: "bundled", publicRelease: false, publicDownload: true,
    url, downloadUrl: url, checksumUrl: `${url}.sha256`, taggedUrl: null, releaseUrl: null,
    // Notarization is never inferred from the existence of an ad-hoc signature.
    notarized: data.notarized === true
  };
}

/** The public repository distribution is a real download, not a GitHub Release. */
export function parseDistribution(data) {
  if (!data || data.url !== PUBLIC_DOWNLOAD_URL || data.distribution !== "repository-distribution" ||
      data.publicRelease !== false || data.publicDownload !== true) {
    throw new Error("Untrusted public distribution metadata");
  }
  const release = parseBundledRelease(data, { base: "." });
  return { ...release, source: "repository", distribution: "repository-distribution",
    url: PUBLIC_DOWNLOAD_URL, downloadUrl: PUBLIC_DOWNLOAD_URL,
    checksumUrl: `${PUBLIC_DOWNLOAD_URL}.sha256`, releaseUrl: null, taggedUrl: null };
}

async function fetchJson(fetcher, url, { signal, timeoutMs = 1800 } = {}) {
  if (signal?.aborted) throw new Error("Release request cancelled");
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 30000) throw new Error("Invalid request timeout");
  const controller = new AbortController();
  let rejectCancellation;
  const cancellation = new Promise((_, reject) => { rejectCancellation = reject; });
  const abort = () => { controller.abort(); rejectCancellation(new Error("Release request cancelled")); };
  signal?.addEventListener("abort", abort, { once: true });
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(() => fetcher(url, {
        signal: controller.signal, credentials: "omit", cache: "no-store",
        headers: { Accept: "application/vnd.github+json" }
      })).then(response => {
        if (!response?.ok || typeof response.json !== "function") throw new Error("Release response unavailable");
        return response.json();
      }),
      new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error("Release request timed out")); }, timeoutMs);
      }),
      cancellation
    ]);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

/** Prefer GitHub Releases, then the public distribution, then the actual local bundle. */
export async function getLatestRelease(fetcher = globalThis.fetch, { signal, timeoutMs = 1800, fallback, base } = {}) {
  if (typeof fetcher !== "function") throw new Error("A fetch implementation is required");
  let bundled = fallback == null ? null : parseBundledRelease(fallback, { base });
  try {
    return parseRelease(await fetchJson(fetcher, GITHUB_API_URL, { signal, timeoutMs }));
  } catch {
    try {
      return parseDistribution(await fetchJson(fetcher, PUBLIC_DISTRIBUTION_URL, { signal, timeoutMs }));
    } catch {
      // Neither a missing release nor a network error invents a publication.
    }
    if (bundled) return bundled;
    const localMetadata = new URL("../downloads/release.json", import.meta.url).href;
    bundled = parseBundledRelease(await fetchJson(fetcher, localMetadata, { signal, timeoutMs }), { base });
    return bundled;
  }
}

export function resolveRelease({ fallback, fetcher = globalThis.fetch, signal, timeoutMs = 1800, base } = {}) {
  return getLatestRelease(fetcher, { fallback, signal, timeoutMs, base });
}
