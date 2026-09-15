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
        <div className="download-grid reveal">
          {[
            {
              id: "mac",
              title: "Allm4 para macOS",
              subtitle: "Apple Silicon",
              icon: Apple,
              url: release.mac,
              format: ".DMG",
              button: "Baixar para Mac",
            },
            {
              id: "windows",
              title: "Allm4 para Windows",
              subtitle: "Seu ambiente no desktop",
              icon: WindowsIcon,
              url: release.windows,
              format: ".EXE",
              button: "Baixar para Windows",
            },
          ].map((p) => (
            <article className="download-card" key={p.id}>
              <div className="platform-icon">
                <p.icon />
              </div>
              <div>
                <h3>{p.title}</h3>
                <p>{p.subtitle}</p>
              </div>
              <a href={p.url ?? release.url} className="button download-button">
                {p.url ? p.button : "Ver opções de download"}
                <Download size={16} />
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
          ))}
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
        Após abrir o DMG e arrastar o Allm4 para <strong>Aplicativos</strong>, o
        macOS pode bloquear sua abertura. Nesse caso, abra o{" "}
        <strong>Terminal</strong>, cole o comando abaixo e pressione Enter para
        remover a quarentena do Allm4. Depois, abra o aplicativo novamente.
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
          ? "Não foi possível copiar automaticamente. Selecione e copie o comando acima."
          : copyState === "copied"
            ? "Comando copiado. Cole no Terminal após mover o Allm4 para Aplicativos."
            : "Use o comando apenas para o Allm4 obtido pelos downloads oficiais acima. Ele remove a quarentena somente desse aplicativo."}
      </p>
    </aside>
  );
}
