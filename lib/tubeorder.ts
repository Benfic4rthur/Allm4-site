const repository = "https://github.com/Benfic4rthur/TubeOrder";
export const tubeOrderLinks = {
  repository,
  releaseApi: "https://api.github.com/repos/Benfic4rthur/TubeOrder/releases/latest",
  releases: `${repository}/releases/latest`,
};
export type TubeOrderRelease = { version: string; filename: string; download: string; size: number };

export function parseTubeOrderRelease(data: unknown): TubeOrderRelease | null {
  if (!data || typeof data !== "object") return null;
  const release = data as Record<string, unknown>;
  if (release.draft !== false || release.prerelease !== false || typeof release.tag_name !== "string" || !Array.isArray(release.assets)) return null;
  const version = /^v?(\d+(?:\.\d+){1,3})$/.exec(release.tag_name)?.[1];
  if (!version) return null;
  for (const filename of [`tubeorder-${version}.zip`, `tubeorder-v${version}.zip`, "tubeorder.zip"]) {
    for (const asset of release.assets) {
      if (!asset || typeof asset !== "object") continue;
      const entry = asset as Record<string, unknown>;
      if (entry.name !== filename || entry.state !== "uploaded" || typeof entry.browser_download_url !== "string" || typeof entry.size !== "number" || !Number.isSafeInteger(entry.size) || entry.size <= 0) continue;
      try {
        const url = new URL(entry.browser_download_url);
        if (url.protocol !== "https:" || url.host !== "github.com" || url.username || url.password || url.search || url.hash || url.pathname !== `/Benfic4rthur/TubeOrder/releases/download/${release.tag_name}/${filename}`) continue;
        return { version, filename, download: url.href, size: entry.size };
      } catch { /* Ignore unrelated or malformed assets. */ }
    }
  }
  return null;
}

export function tubeOrderPackageSize(bytes: number) {
  const unit = bytes < 1_000_000 ? "KB" : "MB";
  return { value: (bytes / (unit === "KB" ? 1000 : 1_000_000)).toLocaleString("pt-BR", { maximumFractionDigits: 1 }), unit };
}

export async function fetchTubeOrderRelease(fetcher: typeof fetch = fetch, signal?: AbortSignal): Promise<TubeOrderRelease | null> {
  try {
    const response = await fetcher(tubeOrderLinks.releaseApi, { signal, cache: "no-store", credentials: "omit", headers: { Accept: "application/vnd.github+json" } });
    return response.ok ? parseTubeOrderRelease(await response.json()) : null;
  } catch { return null; }
}
