const repository = "https://github.com/Benfic4rthur/codex-reset";

export const codexResetLinks = {
  repository,
  releases: `${repository}/releases/latest`,
  releaseApi: "https://api.github.com/repos/Benfic4rthur/codex-reset/releases/latest",
  appleSilicon: `${repository}/releases/latest/download/Codex-Reset-Apple-Silicon.dmg`,
  intel: `${repository}/releases/latest/download/Codex-Reset-Intel.dmg`,
  guide: `${repository}#como-instalar`,
  privacy: `${repository}/blob/main/PRIVACY.md`,
  issues: `${repository}/issues`,
};

export const codexResetInstallCommand = `if [ -d "/Applications/Codex Reset.app" ]; then
  xattr -dr com.apple.quarantine "/Applications/Codex Reset.app"
elif [ -d "$HOME/Applications/Codex Reset.app" ]; then
  xattr -dr com.apple.quarantine "$HOME/Applications/Codex Reset.app"
else
  echo "Copie primeiro o Codex Reset.app do DMG para a pasta Aplicativos."
fi`;

export type CodexResetRelease = {
  version: string;
  appleSilicon: string;
  intel: string;
};

export function parseCodexResetRelease(data: unknown): CodexResetRelease | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const release = data as Record<string, unknown>;
  if (
    release.draft !== false ||
    release.prerelease !== false ||
    typeof release.tag_name !== "string" ||
    !/^v?\d+\.\d+\.\d+$/.test(release.tag_name) ||
    !Array.isArray(release.assets)
  ) return null;

  const tag = release.tag_name;
  const assets: unknown[] = release.assets;

  function asset(name: string): string | null {
    for (const value of assets) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const entry = value as Record<string, unknown>;
      if (
        entry.name !== name ||
        entry.state !== "uploaded" ||
        typeof entry.browser_download_url !== "string"
      ) continue;

      try {
        const url = new URL(entry.browser_download_url);
        if (
          url.origin === "https://github.com" &&
          !url.username && !url.password && !url.search && !url.hash &&
          url.pathname === `/Benfic4rthur/codex-reset/releases/download/${tag}/${name}`
        ) return entry.browser_download_url;
      } catch {
        // An invalid asset cannot replace the public latest/download fallback.
      }
    }
    return null;
  }

  const appleSilicon = asset("Codex-Reset-Apple-Silicon.dmg");
  const intel = asset("Codex-Reset-Intel.dmg");
  if (!appleSilicon || !intel) return null;

  return { version: tag.replace(/^v/, ""), appleSilicon, intel };
}
