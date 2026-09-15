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
} from "lucide-react";
import { fallbackRelease, parseRelease, siteConfig } from "@/lib/site-config";

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
    const timeout = setTimeout(() => controller.abort(), 6000);

    fetch(
      "https://api.github.com/repos/Benfic4rthur/Allm4-Releases/releases/latest",
      {
        signal: controller.signal,
        credentials: "omit",
        referrerPolicy: "no-referrer",
        headers: { Accept: "application/vnd.github+json" },
      },
    )
      .then((r) => {
        const contentType = r.headers.get("content-type") ?? "";
        return r.ok && contentType.includes("application/json") ? r.json() : null;
      })
      .then((data) => {
        const next = parseRelease(data);
        if (next) setRelease(next);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));

    return () => {
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
    <section className="download-section section" id="download">
      <div className="wrap">
        <div className="download-heading reveal">
          <div className="eyebrow">
            <span className="status-dot" /> O PRÓXIMO PASSO É SEU
          </div>
          <h2>
            Seu computador já pode
            <br />
            fazer <span>muito mais.</span>
          </h2>
          <p>Abra espaço para uma inteligência artificial que é sua.</p>
        </div>

        <div
          className="reveal mx-auto mb-5 max-w-[622px] rounded-[10px] border border-[#ffffff12] bg-[#171714] px-5 py-4"
          aria-label="Como funciona o acesso ao Allm4"
        >
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
          <p className="mt-2 text-center font-mono text-[8px] tracking-[0.11em] text-[#c7c2b6]">
            SEM MENSALIDADE · SEM ASSINATURA · FUTURAS ATUALIZAÇÕES INCLUÍDAS
          </p>
        </div>

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
                      title="Contagem pública de downloads deste instalador"
                      aria-label={`${visibleDownloads} downloads`}
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
