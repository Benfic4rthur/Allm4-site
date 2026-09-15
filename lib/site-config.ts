const trustedReleaseOwner = "Benfic4rthur";
const downloadCountBaseline = 1;

export const siteConfig = {
  name: "Allm4",
  cta: { label: "Baixar Allm4", href: "#download" },
  repository: "https://github.com/Benfic4rthur/Allm4-Releases",
  releases: "https://github.com/Benfic4rthur/Allm4-Releases/releases",
  contactEmail: "suporte@allm4.com",
  privacyUrl: "",
  termsUrl: "",
};

export type Release = {
  version: string;
  url: string;
  mac: string | null;
  windows: string | null;
  macDownloads: number;
  windowsDownloads: number;
};

export const fallbackRelease: Release = {
  version: "0.1.13",
  url: "https://github.com/Benfic4rthur/Allm4-Releases/releases/tag/v0.1.13",
  mac: "https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v0.1.13/Allm4-0.1.13.dmg",
  windows:
    "https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v0.1.13/Allm4-Setup-0.1.13.exe",
  macDownloads: 2,
  windowsDownloads: 2,
};

function hasTrustedLogin(value: unknown) {
  if (!value || typeof value !== "object") return false;
  return (value as Record<string, unknown>).login === trustedReleaseOwner;
}

function isOfficialAssetUrl(value: string, tag: string, fileName: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.pathname ===
        `/Benfic4rthur/Allm4-Releases/releases/download/${tag}/${fileName}`
    );
  } catch {
    return false;
  }
}

function displayDownloadCount(value: unknown) {
  if (!Number.isSafeInteger(value) || (value as number) < 0) return 2;
  return Math.max(2, (value as number) + downloadCountBaseline);
}

export function parseRelease(data: unknown): Release | null {
  if (!data || typeof data !== "object") return null;
  const release = data as Record<string, unknown>;
  if (
    release.draft !== false ||
    release.prerelease !== false ||
    !hasTrustedLogin(release.author) ||
    typeof release.tag_name !== "string" ||
    !/^v?\d+\.\d+\.\d+$/.test(release.tag_name) ||
    !Array.isArray(release.assets)
  )
    return null;

  const tag = release.tag_name;
  const version = tag.replace(/^v/, "");
  const assets: unknown[] = release.assets;

  const asset = (fileName: string) => {
    const entry = assets.find((value): value is Record<string, unknown> => {
      if (!value || typeof value !== "object") return false;
      const candidate = value as Record<string, unknown>;
      return (
        candidate.name === fileName &&
        candidate.state === "uploaded" &&
        hasTrustedLogin(candidate.uploader) &&
        typeof candidate.digest === "string" &&
        /^sha256:[0-9a-f]{64}$/i.test(candidate.digest) &&
        typeof candidate.browser_download_url === "string" &&
        isOfficialAssetUrl(candidate.browser_download_url, tag, fileName)
      );
    });

    if (!entry || typeof entry.browser_download_url !== "string") return null;

    return {
      url: entry.browser_download_url,
      downloads: displayDownloadCount(entry.download_count),
    };
  };

  const mac = asset(`Allm4-${version}.dmg`);
  const windows = asset(`Allm4-Setup-${version}.exe`);
  if (!mac && !windows) return null;

  return {
    version,
    url: `${siteConfig.releases}/tag/${tag}`,
    mac: mac?.url ?? null,
    windows: windows?.url ?? null,
    macDownloads: mac?.downloads ?? 2,
    windowsDownloads: windows?.downloads ?? 2,
  };
}
