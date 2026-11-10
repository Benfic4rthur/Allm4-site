export const releaseConfig = {
  owner: "Benfic4rthur",
  repository: "GelaMac",
  asset: "GelaMac-macOS-arm64.zip",
  bundledVersion: "1.4.0",
  bundledUrl: "/gelamac/downloads/GelaMac-macOS-arm64.zip",
} as const;

export type ReleaseInfo = { version: string; url: string; source: "github" | "bundled"; page: string };
export const bundledRelease: ReleaseInfo = {
  version: releaseConfig.bundledVersion,
  url: releaseConfig.bundledUrl,
  source: "bundled",
  page: `https://github.com/${releaseConfig.owner}/${releaseConfig.repository}/releases`,
};

// Same release contract as the original server route, now compatible with Pages.
export function parseGelaMacRelease(data: unknown): ReleaseInfo | null {
  if (!data || typeof data !== "object") return null;
  const release = data as { tag_name?: string; draft?: boolean; prerelease?: boolean; assets?: { name: string }[] };
  const version = typeof release.tag_name === "string" ? release.tag_name.replace(/^v/, "") : null;
  if (!version || !/^\d+\.\d+\.\d+$/.test(version) || release.draft || release.prerelease || !Array.isArray(release.assets) || !release.assets.some(a => a?.name === releaseConfig.asset)) return null;
  const root = `https://github.com/${releaseConfig.owner}/${releaseConfig.repository}/releases`;
  return { version, url: `${root}/latest/download/${releaseConfig.asset}`, source: "github", page: `${root}/tag/${encodeURIComponent(release.tag_name!)}` };
}

export async function fetchGelaMacRelease(fetcher: typeof fetch = fetch, signal?: AbortSignal): Promise<ReleaseInfo> {
  try {
    const response = await fetcher(`https://api.github.com/repos/${releaseConfig.owner}/${releaseConfig.repository}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      credentials: "omit", cache: "no-store",
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(5000)]) : AbortSignal.timeout(5000),
    });
    return response.ok ? parseGelaMacRelease(await response.json()) ?? bundledRelease : bundledRelease;
  } catch { return bundledRelease; }
}
