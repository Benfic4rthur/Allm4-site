export const siteConfig = {
  name: "Allm4",
  cta: { label: "Baixar Allm4", href: "#download" },
  repository: "https://github.com/Benfic4rthur/Allm4-Releases",
  releases: "https://github.com/Benfic4rthur/Allm4-Releases/releases",
  contactEmail: "arthur_benfica@hotmail.com",
  whatsapp: "https://wa.me/5551991640517",
  whatsappLabel: "+55 (51) 99164-0517",
  privacyUrl: "",
  termsUrl: "",
};

export type Release = {
  version: string;
  url: string;
  mac: string | null;
  windows: string | null;
};

export const fallbackRelease: Release = {
  version: "0.1.12",
  url: "https://github.com/Benfic4rthur/Allm4-Releases/releases/tag/v0.1.12",
  mac: "https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v0.1.12/Allm4-0.1.12.dmg",
  windows:
    "https://github.com/Benfic4rthur/Allm4-Releases/releases/download/v0.1.12/Allm4-Setup-0.1.12.exe",
};

function isOfficialAssetUrl(value: string, tag: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.pathname.startsWith(
        `/Benfic4rthur/Allm4-Releases/releases/download/${tag}/`,
      )
    );
  } catch {
    return false;
  }
}

export function parseRelease(data: unknown): Release | null {
  if (!data || typeof data !== "object") return null;
  const release = data as Record<string, unknown>;
  if (
    release.draft !== false ||
    release.prerelease !== false ||
    typeof release.tag_name !== "string" ||
    !/^v?\d+\.\d+\.\d+$/.test(release.tag_name) ||
    !Array.isArray(release.assets)
  )
    return null;

  const tag = release.tag_name;
  const assets: unknown[] = release.assets;
  const asset = (extension: string) => {
    const entry = assets.find((value): value is Record<string, unknown> => {
      if (!value || typeof value !== "object") return false;
      const candidate = value as Record<string, unknown>;
      return (
        typeof candidate.name === "string" &&
        candidate.name.toLowerCase().endsWith(extension) &&
        candidate.state === "uploaded" &&
        typeof candidate.browser_download_url === "string" &&
        isOfficialAssetUrl(candidate.browser_download_url, tag)
      );
    });
    return typeof entry?.browser_download_url === "string"
      ? entry.browser_download_url
      : null;
  };

  const mac = asset(".dmg");
  const windows = asset(".exe");
  if (!mac && !windows) return null;

  return {
    version: tag.replace(/^v/, ""),
    url: `${siteConfig.releases}/tag/${tag}`,
    mac,
    windows,
  };
}
