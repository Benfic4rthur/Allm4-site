"use client";
import { useEffect, useState } from "react";
import {
  Apple,
  Download,
  ArrowUpRight,
  RefreshCw,
  Terminal,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  fallbackRelease,
  parseReleaseHistory,
  siteConfig,
} from "@/lib/site-config";

function WindowsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="27"
      height="27"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 3h9v9H2zM13 3h9v9h-9zM2 14h9v9H2zM13 14h9v9h-9z" />
    </svg>
  );
}

export function Downloads() {
  const [release, setRelease] = useState(fallbackRelease);
  const [downloadBoost, setDownloadBoost] = useState({ mac: 0, windows: 0 });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let active = true;

    async function loadReleaseHistory() {
      const releases: unknown[] = [];

      for (let page = 1; page <= 10; page += 1) {
        const response = await fetch(
          `https://api.github.com/repos/Benfic4rthur/Allm4-Releases/releases?per_page=100&page=${page}`,
          {
            signal: controller.signal,
            credentials: "omit",
            referrerPolicy: "no-referrer",
            headers: { Accept: "application/vnd.github+json" },
          },
        );
        const contentType = response.headers.get("content-type") ?? "";
        if (!response.ok || !contentType.includes("application/json")) return;

        const data: unknown = await response.json();
        if (!Array.isArray(data)) return;

        releases.push(...data);
        if (data.length < 100) break;
      }

      const next = parseReleaseHistory(releases);
      if (active && next) setRelease(next);
    }

    void loadReleaseHistory()
      .catch(() => {})
      .finally(() => clearTimeout(timeout));

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  function noteDownload(platform: "mac" | "windows") {
    setDownloadBoost((current) => ({
      ...current,
      [platform]: current[platform] + 1,
    }));
  }

  const platforms = [
    {
      id: "mac" as const,
      title: "Allm4 para macOS",
      subtitle: "Apple Silicon",
      icon: Apple,
      url: release.mac,
      format: ".DMG",
      button: "Baixar para Mac",
      downloads: release.macDownloads,
    },
    {
      id: "windows" as const,
      title: "Allm4 para Windows",
      subtitle: "Seu ambiente no desktop",
      icon: WindowsIcon,
      url: release.windows,
      format: ".EXE",
      button: "Baixar para Windows",
      downloads: release.windowsDownloads,
    },
  ];

  return (
    <section className="download-section section">
      <div className="wrap">
        <div className="download-heading reveal">
          <div className="eyebrow">
            <span className="status-dot" /> O PRÓXIMO PASSO É SEU
          </div>
          <h2 id="download" style={{ scrollMarginTop: "-68px" }}>
            Seu computador já pode
            <br />
            fazer <span>muito mais.</span>
          </h2>
          <p>Abra espaço para uma inteligência artificial que é sua.</p>
        </div>

        <AccessInfo />

        <div className="download-grid reveal">
          {platforms.map((p) => {
            const visibleDownloads = p.downloads + downloadBoost[p.id];

            return (
              <article className="download-card" key={p.id}>
                <div className="platform-icon">
                  <p.icon />
                </div>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.subtitle}</p>
                </div>
                <a
                  href={p.url ?? release.url}
                  className="button download-button"
                  onClick={() => {
                    if (p.url) noteDownload(p.id);
                  }}
                >
                  <span>{p.url ? p.button : "Ver opções de download"}</span>
                  {p.url ? (
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-medium opacity-70"
                      title="Contagem pública acumulada de downloads de todas as versões"
                      aria-label={`${visibleDownloads} downloads acumulados`}
                    >
                      <Download size={13} />
                      {visibleDownloads} downloads
                    </span>
                  ) : (
                    <Download size={16} />
                  )}
                </a>
                <div className="download-meta">
                  <span>Versão {release.version}</span>
                  <span>
                    {p.url ? `INSTALADOR ${p.format}` : "GITHUB RELEASES"}
                  </span>
                </div>
                {p.id === "mac" && (
                  <a className="mac-install-link" href="#instalacao-mac">
                    <Terminal size={12} /> Primeira abertura: veja a orientação
                    para Mac ↓
                  </a>
                )}
              </article>
            );
          })}
        </div>

        <MacInstallGuide />

        <div className="release-links">
          <a href={release.url} target="_blank" rel="noopener noreferrer">
            O que há de novo <ArrowUpRight size={12} />
          </a>
          <span />
          <a
            href={siteConfig.releases}
            target="_blank"
            rel="noopener noreferrer"
          >
            Todas as versões <ArrowUpRight size={12} />
          </a>
        </div>
        <p className="update-note">
          <RefreshCw size={13} /> O Allm4 conta com seu próprio sistema de
          atualização.
        </p>
      </div>
    </section>
  );
}

function AccessInfo() {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;

  return (
    <div
      className="reveal mx-auto mt-3 mb-3 max-w-[680px] overflow-hidden rounded-[10px] border border-[#ffffff12] bg-[#171714] transition-[border-color,background-color] duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 px-4 py-3 text-center font-mono text-[8px] tracking-[0.12em] text-[#c7c2b6] transition-colors hover:text-[#f49a78] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#f67c5260]"
        aria-expanded={open}
        aria-controls="allm4-access-details"
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => setPinned((current) => !current)}
      >
        <span>SEM MENSALIDADE · SEM ASSINATURA · FUTURAS ATUALIZAÇÕES INCLUÍDAS</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div
        id="allm4-access-details"
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#ffffff10] px-5 pb-4 pt-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center font-mono text-[8px] tracking-[0.12em]">
              <span className="rounded-full border border-[#ffffff12] px-3 py-1.5 text-[#a9a69d]">
                USO GRATUITO INICIAL
              </span>
              <span className="rounded-full border border-[#f67c5240] bg-[#f67c520c] px-3 py-1.5 text-[#f49a78]">
                PAGAMENTO ÚNICO E VITALÍCIO
              </span>
            </div>
            <p className="mx-auto mt-3 max-w-[560px] text-center text-[11px] leading-[1.75] text-[#9d9b92]">
              Comece usando o Allm4 gratuitamente. Ao atingir o limite de uso
              gratuito, o acesso completo é liberado com um pagamento único e de
              valor simbólico, pensado para ajudar a manter o projeto e seu
              desenvolvimento contínuo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacInstallGuide() {
  const command = 'xattr -dr com.apple.quarantine "/Applications/Allm4.app"';
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <aside
      className="mac-install-guide reveal"
      id="instalacao-mac"
      aria-labelledby="mac-install-title"
    >
      <div className="mac-guide-title">
        <Terminal size={17} />
        <h3 id="mac-install-title">Primeira abertura no macOS</h3>
        <span>APPLE SILICON</span>
      </div>
      <p>
        <strong>
          Na maioria dos Macs, o Allm4 abre normalmente e você não precisa usar
          este comando.
        </strong>{" "}
        Depois de abrir o DMG e arrastar o Allm4 para <strong>Aplicativos</strong>,
        tente abrir o app normalmente. Só se o macOS bloquear a abertura, abra o{" "}
        <strong>Terminal</strong>, cole o comando abaixo e pressione Enter. Depois,
        abra o Allm4 novamente.
      </p>
      <div className="command-block">
        <code>{command}</code>
        <button
          onClick={copyCommand}
          aria-label="Copiar comando de instalação para Mac"
        >
          {copyState === "copied" ? <Check size={14} /> : <Copy size={14} />}
          <span>{copyState === "copied" ? "Copiado" : "Copiar"}</span>
        </button>
      </div>
      <p className="copy-status" role="status">
        {copyState === "error"
          ? "Não foi possível copiar automaticamente. Se o macOS tiver bloqueado o Allm4, selecione e copie o comando acima."
          : copyState === "copied"
            ? "Comando copiado. Use-o somente se o macOS tiver bloqueado a abertura do Allm4."
            : "Este comando é apenas uma alternativa para quando o macOS bloquear a primeira abertura. Na maioria das instalações ele não será necessário."}
      </p>
    </aside>
  );
}
