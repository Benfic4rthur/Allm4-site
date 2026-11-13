"use client";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { canalNonGratoLinks, canalNonGratoPackageSize, parseCanalNonGratoRelease, type CanalNonGratoRelease } from "@/lib/canalnongrato";

const ReleaseContext = createContext<CanalNonGratoRelease | null>(null);
export const useCanalNonGratoRelease = () => useContext(ReleaseContext);

export function CanalNonGratoReleaseProvider({ children }: { children: ReactNode }) {
  useSiteLanguage();
  const [release, setRelease] = useState<CanalNonGratoRelease | null>(null);
  useEffect(() => {
    let disposed = false;
    let request: AbortController | null = null;
    async function refresh() {
      if (request) return;
      const controller = new AbortController();
      request = controller;
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(canalNonGratoLinks.releaseApi, { signal: controller.signal, cache: "no-store", credentials: "omit", headers: { Accept: "application/vnd.github+json" } });
        const latest = response.ok ? parseCanalNonGratoRelease(await response.json()) : null;
        if (!disposed) setRelease(latest);
      } catch {
        if (!disposed) setRelease(null);
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
  return localizeTree(<ReleaseContext.Provider value={release}>{children}</ReleaseContext.Provider>);
}

export function CanalNonGratoReleaseNote() {
  useSiteLanguage();
  const release = useCanalNonGratoRelease();
  const size = release ? canalNonGratoPackageSize(release.size) : null;
  return localizeTree(<p className="cng-release-note" aria-live="polite">Grátis <span>·</span> {release ? `v${release.version}` : "Última versão no GitHub"}{size ? <><span>·</span> Pacote de {size.value} {size.unit}</> : null}</p>);
}

export function CanalNonGratoPackageSize() {
  useSiteLanguage();
  const release = useCanalNonGratoRelease();
  const size = release ? canalNonGratoPackageSize(release.size) : null;
  return localizeTree(<div className="cng-weight-number">{size?.value ?? "ZIP"}<span>{size?.unit ?? ""}</span><span className="cng-weight-caption">{release ? "TAMANHO DA VERSÃO MAIS RECENTE." : "PACOTE DISPONÍVEL NO GITHUB."}</span></div>);
}
