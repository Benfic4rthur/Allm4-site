"use client";

import { Apple, ArrowDownToLine, Cpu } from "lucide-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  codexResetLinks,
  parseCodexResetRelease,
  type CodexResetRelease,
} from "@/lib/codex-reset";

const ReleaseContext = createContext<CodexResetRelease | null>(null);

export function CodexResetReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<CodexResetRelease | null>(null);

  useEffect(() => {
    let disposed = false;
    let request: AbortController | null = null;

    async function refresh() {
      if (request) return;
      const controller = new AbortController();
      request = controller;
      const timeout = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(codexResetLinks.releaseApi, {
          signal: controller.signal,
          cache: "no-store",
          headers: { Accept: "application/vnd.github+json" },
        });
        const latest = response.ok
          ? parseCodexResetRelease(await response.json())
          : null;
        if (!disposed) setRelease(latest);
      } catch {
        // Keep downloads usable without guessing a version when GitHub is unavailable.
        if (!disposed) setRelease(null);
      } finally {
        clearTimeout(timeout);
        request = null;
      }
    }

    function refreshWhenVisible() {
      if (!document.hidden) void refresh();
    }

    void refresh();
    const interval = setInterval(refreshWhenVisible, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      disposed = true;
      request?.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  return <ReleaseContext.Provider value={release}>{children}</ReleaseContext.Provider>;
}

export function CodexResetVersion() {
  const release = useContext(ReleaseContext);
  return (
    <span className="cr-release-version" aria-live="polite">
      {release ? `Versão ${release.version}` : "Última versão no GitHub"}
    </span>
  );
}

export function CodexResetDownloadOptions() {
  const release = useContext(ReleaseContext);
  return (
    <div className="cr-download-options">
      <a className="cr-download-card" href={release?.appleSilicon ?? codexResetLinks.appleSilicon}>
        <Apple size={28} strokeWidth={1.4} aria-hidden="true" />
        <span><strong>Apple Silicon</strong><small>M1, M2, M3 e posteriores · DMG</small></span>
        <ArrowDownToLine size={20} aria-hidden="true" />
      </a>
      <a className="cr-download-card" href={release?.intel ?? codexResetLinks.intel}>
        <Cpu size={28} strokeWidth={1.4} aria-hidden="true" />
        <span><strong>Intel</strong><small>Mac com processador Intel · DMG</small></span>
        <ArrowDownToLine size={20} aria-hidden="true" />
      </a>
    </div>
  );
}
