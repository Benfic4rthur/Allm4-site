"use client";

import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import { BrandLockup } from "./brand-mark";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function StudioHeader({ current }: { current?: "games" }) {
  useSiteLanguage();
  const home = current ? `${basePath}/` : "";
  return localizeTree(
    <header className="studio-header">
      <div className="studio-shell studio-header-inner">
        <BrandLockup href={home || "#inicio"} />
        <nav className="studio-main-nav" aria-label="Navegação principal">
          <a href={`${home}#produtos`}>Aplicativos</a>
          <a className="studio-nav-extensions" href={`${home}#extensoes`}>Extensões</a>
          <a className="studio-nav-games" href={`${basePath}/games/`} aria-current={current === "games" ? "page" : undefined}>Games</a>
          <a className="studio-nav-about" href={`${home}#sobre`}>Sobre Arthur</a>
        </nav>
      </div>
    </header>,
  );
}
