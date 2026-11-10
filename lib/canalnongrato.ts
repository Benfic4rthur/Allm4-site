const repository = "https://github.com/Benfic4rthur/CanalNonGrato";

export const canalNonGratoLinks = {
  repository,
  releaseApi: "https://api.github.com/repos/Benfic4rthur/CanalNonGrato/releases/latest",
  releases: `${repository}/releases/latest`,
};

export type CanalNonGratoRelease = {
  version: string;
  filename: string;
  download: string;
  size: number;
};

export function parseCanalNonGratoRelease(data: unknown): CanalNonGratoRelease | null {
  if (!data || typeof data !== "object") return null;
  const release = data as Record<string, unknown>;
  if (release.draft !== false || release.prerelease !== false || typeof release.tag_name !== "string" || !Array.isArray(release.assets)) return null;
  const version = /^v?(\d+(?:\.\d+){1,3})$/.exec(release.tag_name)?.[1];
  if (!version) return null;

  for (const filename of [`CanalNonGrato-${version}.zip`, "CanalNonGrato.zip"]) {
    for (const asset of release.assets) {
      if (!asset || typeof asset !== "object") continue;
      const entry = asset as Record<string, unknown>;
      if (entry.name !== filename || entry.state !== "uploaded" || typeof entry.browser_download_url !== "string" || typeof entry.size !== "number" || !Number.isSafeInteger(entry.size) || entry.size <= 0) continue;
      try {
        const url = new URL(entry.browser_download_url);
        if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.search || url.hash || url.pathname !== `/Benfic4rthur/CanalNonGrato/releases/download/${release.tag_name}/${filename}`) continue;
        return { version, filename, download: entry.browser_download_url, size: entry.size };
      } catch { /* Ignore malformed asset URLs. */ }
    }
  }
  return null;
}

export function canalNonGratoPackageSize(bytes: number): { value: string; unit: string } {
  return bytes < 1_000_000
    ? { value: String(Math.max(1, Math.round(bytes / 1_000))), unit: "KB" }
    : { value: (bytes / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }), unit: "MB" };
}
