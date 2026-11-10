"use client";
import { useEffect, useState, type ReactNode, type KeyboardEvent } from "react";
import { useCanalNonGratoRelease } from "./release";
import { canalNonGratoLinks, canalNonGratoPackageSize } from "@/lib/canalnongrato";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
type IconName = "ban" | "download" | "arrow" | "down" | "check" | "shield" | "user" | "search" | "home" | "list" | "shorts" | "play" | "plus" | "external" | "corner" | "menu" | "close" | "copy" | "chrome" | "edge";
const paths: Record<IconName, ReactNode> = {
    ban: <><circle cx="12" cy="12" r="8.5"/><path d="m6 18 12-12"/></>,
    download: <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>, down: <path d="M12 3v18m-6-6 6 6 6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/></>,
    user: <><circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/></>,
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
    home: <path d="m3 10 9-7 9 7v11H3zM9 21v-8h6v8"/>,
    list: <path d="M8 5h13M8 11h13M8 17h8M3 5h.1M3 11h.1M3 17h.1"/>,
    shorts: <><path d="m16 3-10 6a4 4 0 0 0 0 7l2 1-1 1a3 3 0 0 0 3 4l9-6a4 4 0 0 0 0-7l-2-1 1-1a3 3 0 0 0-2-4Z"/><path d="m10 9 5 3-5 3z"/></>,
    play: <path d="m9 5 11 7-11 7z"/>, plus: <path d="M12 4v16M4 12h16"/>,
    external: <path d="M13 3h8v8m0-8L10 14M9 3H3v18h18v-6"/>,
    corner: <path d="M20 20h-5A7 7 0 0 1 8 13V4m-5 5 5-5 5 5"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>, close: <path d="m5 5 14 14M5 19 19 5"/>,
    copy: <><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/></>,
    chrome: <><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><path d="M12 8h8.5M8.5 14l-4.3-7.4M14 15.5l-4.3 7.3"/></>,
    edge: <><path d="M21 14a9 9 0 1 1-1-8c2 3 1 6-3 6H5c-1 6 9 10 16 2Z"/><path d="M5 12c0-7 12-8 14-2M5 15c3-4 9-1 12-3"/></>,
};
export function Icon({ name, className = "" }: {
    name: IconName;
    className?: string;
}) { return <svg className={`cng-icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>; }
export function Brand() { return <a className="cng-brand" href="#" aria-label="CanalNonGrato, início"><img src={`${publicBasePath}/canalnongrato/brand/canalnongrato.svg`} alt="" width="34" height="34"/><span>Canal<span>NonGrato</span></span></a>; }
export function Header() {
    const [open, setOpen] = useState(false);
    return <><a className="cng-skip-link" href="#conteudo">Pular para o conteúdo</a><header className="cng-site-header"><div className="cng-header-inner cng-section-wrap"><Brand /><button type="button" className="cng-menu-toggle" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"}/></button><nav id="navigation" aria-label="Navegação principal" className={open ? "cng-nav-open" : ""}><a href="#como-funciona" onClick={() => setOpen(false)}>Como funciona</a><a href="#leve" onClick={() => setOpen(false)}>Leve por natureza</a><a href="#instalar" onClick={() => setOpen(false)} className="cng-nav-download">Baixar extensão <Icon name="down"/></a></nav><a className="cng-allm4-link" href={`${publicBasePath}/#extensoes`}>Extensões <strong>ALLM4</strong> <Icon name="external"/></a></div></header></>;
}
type BrowserName = "edge" | "chrome";
export function DownloadLink({ browser, children, className }: {
    browser?: BrowserName;
    children: ReactNode;
    className: string;
}) {
    const release = useCanalNonGratoRelease();
    function selectBrowser() {
        if (!browser) return;
        window.dispatchEvent(new CustomEvent("cng-browser", { detail: browser }));
        document.getElementById("instalar")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
    return <a href={release?.download ?? canalNonGratoLinks.releases} download={release?.filename} target={release ? undefined : "_blank"} rel={release ? undefined : "noopener noreferrer"} className={className} onClick={selectBrowser}>{children}</a>;
}
export function ProductDemo() {
    const [blocked, setBlocked] = useState(false);
    return <div className="cng-product-scene"><div className="cng-scene-halo"/><div className="cng-browser-window"><div className="cng-browser-top"><div className="cng-window-dots"><i /><i /><i /></div><span><Icon name="shield"/> youtube.com</span><Icon name="plus"/></div><div className="cng-mock-yt-nav"><span className="cng-youtube-word"><span><Icon name="play"/></span>YouTube</span><div className="cng-mock-search">Seu próximo vídeo favorito <Icon name="search"/></div><span className="cng-mock-profile">V</span></div><div className="cng-mock-feed"><div className="cng-mock-pills"><span>Para você</span><span>Música</span><span>Tecnologia</span></div><div className="cng-demo-video"><div className="cng-thumbnail cng-thumbnail-sky"><div className="cng-sky-sun"/><div className="cng-mountain cng-mountain-back"/><div className="cng-mountain cng-mountain-front"/><span className="cng-thumb-type">vá mais<br /><em>devagar.</em></span><span className="cng-duration">18:42</span></div><div className="cng-mock-video-info"><span className="cng-channel-avatar cng-avatar-blue">H</span><div><strong>Um novo olhar para o seu dia</strong><span>Horizontes · Um vídeo para você</span></div></div></div><div className={`cng-demo-unwanted ${blocked ? "cng-is-blocked" : ""}`}><div className="cng-mini-thumbnail"><Icon name="play"/><span>DE NOVO?</span></div><div><strong>Aquele canal aparecendo de novo...</strong><span>Canal insistente</span><button type="button" className="cng-demo-block" onClick={() => setBlocked(true)}><Icon name="ban"/> Bloquear</button></div></div>{blocked ? <div className="cng-demo-success"><span><Icon name="check"/> Este canal saiu do seu feed.</span><button type="button" onClick={() => setBlocked(false)}>Desfazer</button></div> : null}</div></div><div className="cng-demo-manager"><div className="cng-mini-brand"><img src={`${publicBasePath}/canalnongrato/brand/canalnongrato.svg`} width="26" height="26" alt=""/><strong>CanalNonGrato</strong><span className="cng-active-dot"/></div><p>Menos ruído.<br />Mais do que importa<span>.</span></p><div className="cng-manager-title">Canais não gratos <span>{blocked ? "1" : "0"}</span></div>{blocked ? <div className="cng-manager-channel"><span className="cng-channel-avatar cng-avatar-coral">CI</span><div><strong>Canal insistente</strong><span>@canalinsistente</span></div><button type="button" onClick={() => setBlocked(false)} aria-label="Desbloquear Canal insistente"><Icon name="ban"/></button></div> : <div className="cng-manager-empty"><Icon name="ban"/><span>Sua lista, suas escolhas.<br />Experimente bloquear o canal ao lado.</span></div>}<div className="cng-manager-footer"><Icon name="shield"/> O controle fica com você.</div></div><div className="cng-demo-caption"><span className="cng-live-dot"/> DEMONSTRAÇÃO INTERATIVA <span className="cng-caption-hint">Clique em Bloquear e veja.</span></div><p className="cng-sr-only" role="status">{blocked ? "Canal insistente bloqueado na demonstração. Você pode desfazer." : "Demonstração com um canal disponível para bloquear."}</p></div>;
}
function BrowserSelector({ selected, onSelect }: {
    selected: BrowserName;
    onSelect: (value: BrowserName) => void;
}) {
    function changeTab(event: KeyboardEvent, browser: BrowserName) {
        if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            const next = event.key === "Home" ? "edge" : event.key === "End" ? "chrome" : browser === "edge" ? "chrome" : "edge";
            onSelect(next);
            document.getElementById(`tab-${next}`)?.focus();
        }
    }
    return <div className="cng-browser-tabs" role="tablist" aria-label="Escolha seu navegador">{(["edge", "chrome"] as const).map(browser => <button type="button" key={browser} id={`tab-${browser}`} role="tab" aria-selected={selected === browser} aria-controls="install-panel" tabIndex={selected === browser ? 0 : -1} onKeyDown={event => changeTab(event, browser)} onClick={() => onSelect(browser)}><Icon name={browser}/> {browser === "edge" ? "Microsoft Edge" : "Google Chrome"}</button>)}</div>;
}
export function Installation() {
    const release = useCanalNonGratoRelease();
    const packageSize = release ? canalNonGratoPackageSize(release.size) : null;
    const [browser, setBrowser] = useState<BrowserName>("edge");
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    useEffect(() => {
        const listener = (event: Event) => { const next = (event as CustomEvent<BrowserName>).detail; if (next === "edge" || next === "chrome") {
            setBrowser(next);
            setCopied(false);
            setCopyError(false);
        } };
        window.addEventListener("cng-browser", listener);
        return () => window.removeEventListener("cng-browser", listener);
    }, []);
    const address = `${browser}://extensions`;
    async function copyAddress() { try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setCopyError(false);
    }
    catch {
        setCopyError(true);
    } }
    function chooseBrowser(value: BrowserName) { setBrowser(value); setCopied(false); setCopyError(false); }
    return <section id="instalar" className="cng-installation"><div className="cng-section-wrap"><div className="cng-install-heading"><div><p className="cng-eyebrow">BAIXOU. INSTALOU. ESCOLHEU.</p><h2>Seu próximo vídeo<br /><em>pode ser melhor.</em></h2></div><p>Escolha seu navegador e siga o guia.<br />Uma instalação, mais controle todos os dias.</p></div><BrowserSelector selected={browser} onSelect={chooseBrowser}/><div id="install-panel" role="tabpanel" aria-labelledby={`tab-${browser}`} tabIndex={0} className="cng-install-panel"><div className="cng-download-card"><div className="cng-download-card-top"><img src={`${publicBasePath}/canalnongrato/brand/canalnongrato.svg`} alt="Ícone do CanalNonGrato" width="62" height="62"/><span className="cng-version-chip" aria-live="polite">{release ? `v${release.version}` : "GitHub"}</span></div><h3>CanalNonGrato</h3><p>Para {browser === "edge" ? "Microsoft Edge" : "Google Chrome"} no computador.</p><DownloadLink className="cng-button cng-button-primary cng-package-download"><Icon name="download"/> {release ? "Baixar pacote .zip" : "Ver pacote no GitHub"} <Icon name="arrow"/></DownloadLink><span className="cng-download-meta">{packageSize ? `${packageSize.value} ${packageSize.unit} · ` : ""}Gratuito · Sem cadastro</span><a className="cng-repository-link" href="https://github.com/Benfic4rthur/CanalNonGrato" target="_blank" rel="noreferrer">Ver código no GitHub <Icon name="external"/></a><p className="cng-source-note">Confira o código, as permissões e as instruções antes de instalar.</p><div className="cng-manual-note"><Icon name="shield"/><p>Última release do GitHub, fora das lojas.<br />A instalação é manual, seguindo os passos ao lado.</p></div></div><div className="cng-install-steps"><article><span className="cng-install-index">1</span><div><h3>Baixe e extraia a pasta</h3><p>Clique em <strong>Baixar pacote .zip</strong> e extraia o arquivo. Guarde a pasta em um lugar fixo no computador.</p><div className="cng-file-example"><Icon name="list"/><span>CanalNonGrato <small>manifest.json + arquivos da extensão</small></span><Icon name="check"/></div></div></article><article><span className="cng-install-index">2</span><div><h3>Abra as extensões do navegador</h3><p>Copie o endereço abaixo e cole na barra de endereços do {browser === "edge" ? "Edge" : "Chrome"}.</p><div className="cng-copy-address"><code>{address}</code><button type="button" onClick={copyAddress} aria-label={`Copiar ${address}`}><Icon name={copied ? "check" : "copy"}/>{copied ? "Copiado" : "Copiar"}</button></div>{copyError ? <p role="status" className="cng-copy-feedback">Selecione o endereço acima e copie com Ctrl+C ou ⌘C.</p> : <span role="status" className="cng-sr-only">{copied ? "Endereço copiado." : ""}</span>}</div></article><article><span className="cng-install-index">3</span><div><h3>Ative e carregue a extensão</h3><p>Ligue o <strong>Modo do desenvolvedor</strong> e clique em <strong>{browser === "edge" ? "Carregar sem pacote" : "Carregar sem compactação"}</strong> (Load unpacked). Selecione a pasta extraída que contém o arquivo <code>manifest.json</code>.</p><div className="cng-developer-mode"><span>Modo do desenvolvedor</span><span className="cng-switch-example" aria-hidden="true"/></div><p className="cng-final-step"><Icon name="check"/> Pronto. Fixe o ícone e recarregue as abas do YouTube.</p></div></article></div></div><p className="cng-install-footnote">Sempre a última release estável do GitHub. Para atualizar, substitua os arquivos na pasta e recarregue a extensão no navegador. <a href={browser === "edge" ? "https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading" : "https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked"} target="_blank" rel="noreferrer">Guia oficial do {browser === "edge" ? "Edge" : "Chrome"} <Icon name="external"/></a></p></div></section>;
}
