"use client";

import { Apple, ArrowDownToLine } from "lucide-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { beiraLinks, parseBeiraRelease, type BeiraRelease } from "@/lib/beira";

const ReleaseContext = createContext<BeiraRelease | null>(null);

export function BeiraReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<BeiraRelease | null>(null);

  useEffect(() => {
    let disposed = false;
    let request: AbortController | null = null;

    async function refresh() {
      if (request) return;
      const controller = new AbortController();
      request = controller;
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(beiraLinks.releaseApi, { signal: controller.signal, cache: "no-store", headers: { Accept: "application/vnd.github+json" } });
        if (!response.ok) return;
        const latest = parseBeiraRelease(await response.json());
        if (latest && !disposed) setRelease(latest);
      } catch {
        // Direct latest/download links remain usable without this optional lookup.
      } finally {
        clearTimeout(timeout);
        request = null;
      }
    }

    function refreshWhenVisible() { if (!document.hidden) void refresh(); }
    void refresh();
    const interval = setInterval(refreshWhenVisible, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => { disposed = true; request?.abort(); clearInterval(interval); document.removeEventListener("visibilitychange", refreshWhenVisible); };
  }, []);

  return <ReleaseContext.Provider value={release}>{children}</ReleaseContext.Provider>;
}

export function BeiraVersion() {
  const release = useContext(ReleaseContext);
  return <span className="beira-release-version" aria-live="polite">{release ? `Versão ${release.version}` : "Última versão no GitHub"}</span>;
}

export function BeiraDownloadOptions() {
  const release = useContext(ReleaseContext);
  return <div className="beira-download-options">
    <a className="beira-download-option" href={release?.appleSilicon ?? beiraLinks.appleSilicon}><Apple size={30} strokeWidth={1.3} aria-hidden="true" /><div><h3>Apple Silicon</h3><p>Mac com chip da família M</p></div><span>Baixar ZIP <ArrowDownToLine size={17} aria-hidden="true" /></span></a>
    <a className="beira-download-option" href={release?.intel ?? beiraLinks.intel}><span className="beira-intel-symbol" aria-hidden="true">intel</span><div><h3>Intel</h3><p>Mac com processador Intel</p></div><span>Baixar ZIP <ArrowDownToLine size={17} aria-hidden="true" /></span></a>
  </div>;
}
