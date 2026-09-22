const trustedReleaseOwner = "Benfic4rthur";
const downloadCountBaseline = 1;

export const siteConfig = {
  name: "Allm4",
  cta: { label: "Baixar Allm4", href: "#download" },
  repository: "https://github.com/Benfic4rthur/Allm4-Releases",
  releases: "https://github.com/Benfic4rthur/Allm4-Releases/releases",
  contactEmail: "arthur_benfica@hotmail.com",
  whatsappUrl: "https://wa.me/5551991640517",
  whatsappLabel: "+55 51 99164-0517",
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

type ParsedInstaller = {
  url: string;
  downloads: number;
};

type ParsedRelease = {
  version: string;
  url: string;
  mac: ParsedInstaller | null;
  windows: ParsedInstaller | null;
};

export const fallbackRelease: Release = {
  version: "0.1.32",
  url: "https://github.com/Benfic4rthur/Allm4-Releases/releases/tag/v0.1.32",
  mac: "https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v0.1.32/Allm4-0.1.32.dmg",
  windows:
    "https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v0.1.32/Allm4-Setup-0.1.32.exe",
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

function rawDownloadCount(value: unknown) {
  return Number.isSafeInteger(value) && (value as number) >= 0
    ? (value as number)
    : 0;
}

function displayDownloadCount(value: number) {
  return Math.max(2, value + downloadCountBaseline);
}

function compareVersions(a: string, b: string) {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);

  for (let index = 0; index < 3; index += 1) {
    if (aParts[index] !== bParts[index]) return aParts[index] - bParts[index];
  }

  return 0;
}

function parseReleaseEntry(data: unknown): ParsedRelease | null {
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

  const asset = (fileName: string): ParsedInstaller | null => {
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
      downloads: rawDownloadCount(entry.download_count),
    };
  };

  const mac = asset(`Allm4-${version}.dmg`);
  const windows = asset(`Allm4-Setup-${version}.exe`);
  if (!mac && !windows) return null;

  return {
    version,
    url: `${siteConfig.releases}/tag/${tag}`,
    mac,
    windows,
  };
}

function publicRelease(
  release: ParsedRelease,
  macDownloads: number,
  windowsDownloads: number,
): Release {
  return {
    version: release.version,
    url: release.url,
    mac: release.mac?.url ?? null,
    windows: release.windows?.url ?? null,
    macDownloads: displayDownloadCount(macDownloads),
    windowsDownloads: displayDownloadCount(windowsDownloads),
  };
}

export function parseRelease(data: unknown): Release | null {
  const release = parseReleaseEntry(data);
  if (!release) return null;

  return publicRelease(
    release,
    release.mac?.downloads ?? 0,
    release.windows?.downloads ?? 0,
  );
}

export function parseReleaseHistory(data: unknown): Release | null {
  if (!Array.isArray(data)) return null;

  const releases = data
    .map(parseReleaseEntry)
    .filter((release): release is ParsedRelease => release !== null);

  if (releases.length === 0) return null;

  const latest = releases.reduce((current, candidate) =>
    compareVersions(candidate.version, current.version) > 0 ? candidate : current,
  );

  const macDownloads = releases.reduce(
    (total, release) => total + (release.mac?.downloads ?? 0),
    0,
  );
  const windowsDownloads = releases.reduce(
    (total, release) => total + (release.windows?.downloads ?? 0),
    0,
  );

  return publicRelease(latest, macDownloads, windowsDownloads);
}
