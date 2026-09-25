"use client";
import { useEffect, useRef, useState } from "react";
import {
  Apple,
  Download,
  ArrowUpRight,
  RefreshCw,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { MediaPlaceholder } from "./site-story";
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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    let loading = false;
    let lastAttemptAt = 0;
    let currentController: AbortController | null = null;

    async function loadReleaseHistory() {
      if (!active || loading) return;
      loading = true;
      lastAttemptAt = Date.now();

      const controller = new AbortController();
      currentController = controller;
      const timeout = setTimeout(() => controller.abort(), 8000);

      try {
        const releases: unknown[] = [];

        for (let page = 1; page <= 10; page += 1) {
          const response = await fetch(
            `https://api.github.com/repos/Benfic4rthur/Allm4-Releases/releases?per_page=100&page=${page}`,
            {
              signal: controller.signal,
              cache: "no-store",
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
      } catch {
        // Keep the last valid release data when GitHub is temporarily unavailable.
      } finally {
        clearTimeout(timeout);
        if (currentController === controller) currentController = null;
        loading = false;
      }
    }

    const refreshIfStale = () => {
      if (Date.now() - lastAttemptAt >= 60_000) void loadReleaseHistory();
    };

    void loadReleaseHistory();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadReleaseHistory();
    }, 3 * 60_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshIfStale();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) refreshIfStale();
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
      currentController?.abort();
    };
  }, []);

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
    <section ref={sectionRef} className="download-section section" id="download" aria-labelledby="download-heading">
      <div className="wrap">
        <div className="download-heading reveal">
          <div className="eyebrow">
            <span className="status-dot" /> O PRÓXIMO PASSO É SEU
          </div>
          <h2 id="download-heading">
            Seu primeiro passo
            <br />
            pode ser <span>simples.</span>
          </h2>
          <p>Escolha seu sistema, instale e deixe o Allm4 guiar o restante.</p>
        </div>

        <AccessInfo />

        <div className="download-grid reveal">
          {platforms.map((p) => {
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
                >
                  <span>{p.url ? p.button : "Ver opções de download"}</span>
                  {p.url ? (
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-medium opacity-70"
                      title="Contagem pública acumulada de downloads de todas as versões"
                      aria-label={`${p.downloads} downloads acumulados`}
                    >
                      <Download size={13} />
                      {p.downloads} downloads
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
                    <Terminal size={12} /> Como instalar no Mac ↓
                  </a>
                )}
                {p.id === "windows" && (
                  <a className="mac-install-link" href="#instalacao-windows">
                    <ShieldCheck size={12} /> Como instalar no Windows ↓
                  </a>
                )}
              </article>
            );
          })}
        </div>

        <div className="install-guides">
          <MacInstallGuide />
          <WindowsInstallGuide />
        </div>

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
  return (
    <section className="access-panel reveal" id="preco" aria-labelledby="access-title">
      <div className="access-copy"><div className="eyebrow">SEM ASSINATURA</div><h3 id="access-title">Experimente primeiro.<br />Decida depois.</h3><p>Comece com o uso gratuito inicial. Ao atingir o limite, o próprio Allm4 mostra o valor e as condições para liberar o acesso.</p></div>
      <div className="access-terms"><strong>Pagamento único.</strong><p>Sem mensalidade para usar o Allm4.</p><ul><li><Check size={17} aria-hidden="true" /> Licença para até 3 computadores</li><li><Check size={17} aria-hidden="true" /> Futuras atualizações incluídas</li><li><Check size={17} aria-hidden="true" /> Gerencie seus dispositivos dentro do app</li></ul><small>Consulte o preço e o limite gratuito no aplicativo antes da compra. Recursos disponíveis dependem da compatibilidade do seu computador.</small></div>
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
        <h3 id="mac-install-title">Como instalar no Mac</h3>
        <span>APPLE SILICON</span>
      </div>
      <ol className="normal-install-steps"><li>Baixe o arquivo <strong>.DMG</strong> pelo botão acima.</li><li>Abra o arquivo e arraste o Allm4 para <strong>Aplicativos</strong>.</li><li>Abra o Allm4 e siga o assistente para preparar sua IA.</li></ol>
      <MediaPlaceholder compact title="como arrastar o Allm4 para Aplicativos no Mac" description="Captura real da janela do instalador com uma seta indicando o movimento." />
      <details className="install-help"><summary>O macOS bloqueou a abertura? Veja a alternativa.</summary>
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
      </details>
    </aside>
  );
}

function WindowsInstallGuide() {
  return (
    <aside
      className="mac-install-guide windows-install-guide reveal"
      id="instalacao-windows"
      aria-labelledby="windows-install-title"
    >
      <div className="mac-guide-title">
        <ShieldCheck size={17} />
        <h3 id="windows-install-title">Como instalar no Windows</h3>
        <span>WINDOWS</span>
      </div>
      <ol className="normal-install-steps"><li>Baixe o instalador <strong>.EXE</strong> pelo botão acima.</li><li>Abra o arquivo e siga as instruções de instalação.</li><li>Abra o Allm4 e siga o assistente para preparar sua IA.</li></ol>
      <MediaPlaceholder compact title="o instalador do Allm4 no Windows" description="Captura real com o botão que a pessoa deve usar para continuar a instalação." />
      <details className="install-help"><summary>Apareceu “O Windows protegeu o computador”?</summary>
      <p>
        <strong>Baixe o instalador somente pelo botão oficial desta página.</strong>{" "}
        Ao abrir o arquivo <strong>Allm4-Setup.exe</strong>, o Windows pode mostrar
        a mensagem “O Windows protegeu o computador” porque o aplicativo ainda não
        tem uma assinatura digital reconhecida.
      </p>
      <ol className="windows-steps">
        <li>Confirme que o arquivo veio do repositório oficial do Allm4.</li>
        <li>Clique em <strong>Mais informações</strong>.</li>
        <li>Clique em <strong>Executar assim mesmo</strong> para continuar.</li>
      </ol>
      <p className="copy-status">
        Não é preciso desativar a proteção do Windows. Em computadores administrados
        por empresa ou escola, essa opção pode estar bloqueada pelo responsável do sistema.
      </p>
      </details>
    </aside>
  );
}
