const repository = "https://github.com/Benfic4rthur/Beira";

export const beiraLinks = {
  repository,
  releaseApi: "https://api.github.com/repos/Benfic4rthur/Beira/releases/latest",
  releases: `${repository}/releases/latest`,
  appleSilicon: `${repository}/releases/latest/download/Beira-AppleSilicon.zip`,
  intel: `${repository}/releases/latest/download/Beira-Intel.zip`,
  guide: `${repository}#instalar-e-liberar-no-macos`,
  issues: `${repository}/issues`,
};

export const beiraInstallCommand = 'xattr -dr com.apple.quarantine "/Applications/Beira.app"';

export type BeiraRelease = { version: string; appleSilicon: string; intel: string };

export function parseBeiraRelease(data: unknown): BeiraRelease | null {
  if (!data || typeof data !== "object") return null;
  const release = data as Record<string, unknown>;
  if (release.draft !== false || release.prerelease !== false || typeof release.tag_name !== "string" || !/^v?\d+\.\d+\.\d+$/.test(release.tag_name) || !Array.isArray(release.assets)) return null;

  function asset(name: string): string | null {
    const match = (release.assets as Record<string, unknown>[]).find((entry) => {
      if (!entry || entry.name !== name || entry.state !== "uploaded" || typeof entry.browser_download_url !== "string") return false;
      try {
        const url = new URL(entry.browser_download_url);
        return url.protocol === "https:" && url.hostname === "github.com" && url.pathname === `/Benfic4rthur/Beira/releases/download/${release.tag_name}/${name}`;
      } catch { return false; }
    });
    return typeof match?.browser_download_url === "string" ? match.browser_download_url : null;
  }

  const appleSilicon = asset("Beira-AppleSilicon.zip");
  const intel = asset("Beira-Intel.zip");
  if (!appleSilicon || !intel) return null;
  return { version: release.tag_name.replace(/^v/, ""), appleSilicon, intel };
}

