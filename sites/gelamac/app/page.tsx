"use client";
import { localizeTree, useSiteLanguage } from "../lib/i18n/runtime";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, Command, Cpu, Menu, Minus, Plus, ShieldCheck, Thermometer, X } from "lucide-react";
import { AppIcon, Demo, Mark, ThermalCycle } from "../components/gelamac-demo";
import { ModeLab } from "../components/gelamac-modes";
import { InstallationGuide } from "../components/installation-guide";
import { bundledRelease, fetchGelaMacRelease, type ReleaseInfo } from "../lib/release-config";

declare global { interface Window { ScrollCraft?: { mount: (root: HTMLElement) => { destroy: () => void } } } }
const faqs = [
  ["Ele funciona no meu Mac?", "Esta prévia requer macOS 14 ou posterior e Apple Silicon com ventoinhas. O controle foi validado no MacBook Pro com M1 Pro. Outros modelos ainda não foram validados. Macs sem ventoinhas, como o MacBook Air, não têm resfriamento ativo para controlar."],
  ["O GelaMac fica sempre com a ventoinha no máximo?", "Você escolhe. O ciclo Gelar usa o máximo até manter o alvo por 30 segundos. A curva ajusta a rotação conforme os pontos salvos. O modo persistente fica no máximo até você desligar. Com a curva ativa, ela tem prioridade sobre os outros modos."],
  ["Como ele decide a temperatura alvo?", "A temperatura de aviso é a referência. Se você configurar aviso a 60 °C e queda de 10 °C, o alvo será 50 °C, mesmo que o início automático esteja em 70 °C. O alvo fica fixo durante o ciclo. A carga de trabalho e o ambiente influenciam a temperatura que o Mac consegue atingir."],
  ["Vou precisar digitar a senha toda vez?", "O macOS pode pedir autorização para o auxiliar na instalação ou atualização. Depois da aprovação inicial, as aberturas normais reconectam automaticamente. O GelaMac não armazena a sua senha."],
  ["Posso deixar iniciar com o macOS?", "Sim. Em Configurações → Geral, ative Iniciar com o macOS. O aplicativo pode ficar apenas na barra de menus, mostrando a temperatura, e abre a janela de configurações quando você precisar."],
  ["A temperatura e as configurações saem do meu Mac?", "A leitura dos sensores, o controle das ventoinhas e as configurações são processados localmente. O GelaMac não precisa de uma conta ou de um serviço na nuvem para resfriar o Mac."],
];

function DownloadDialog({ close, release }: { close: () => void; release: ReleaseInfo }) {
  useSiteLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => el?.close(); }, []);
  return localizeTree(<dialog ref={dialog} className="download-dialog" onCancel={close} onClick={e => { if (e.target === dialog.current) close(); }}><button className="dialog-close icon-button" onClick={close} aria-label="Fechar download"><X size={20} /></button><AppIcon size={76} /><span className="dialog-eyebrow">GELAMAC PARA macOS</span><h2>Um respiro.<br />A poucos cliques.</h2><p>Prévia v{release.version} para Apple Silicon.<br />macOS 14 ou posterior.</p><ol><li>Baixe e descompacte o arquivo ZIP.</li><li>Execute Instalar.command conforme o guia de instalação.</li><li>Autorize a primeira abertura e o auxiliar no macOS.</li></ol><a href="#instalacao" className="dialog-guide-link text-link" onClick={close}>Ver instalação passo a passo <ArrowUpRight size={14} /></a><a className="button primary" href={release.url} download="GelaMac-macOS-arm64.zip"><ArrowDownToLine size={18} /> Baixar para macOS</a><small>Prévia de desenvolvimento, validada no MacBook Pro M1 Pro. Ainda não é uma distribuição pública notarizada. Consulte o guia de instalação.</small></dialog>);
}

const subscribeMotion = () => () => {};
const readMotion = () => new URLSearchParams(window.location.search).get("motion") === "reduced";

export default function Home() {
  useSiteLanguage();
  const root = useRef<HTMLElement>(null);
  const [release, setRelease] = useState<ReleaseInfo>(bundledRelease);
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  useEffect(() => {
    const controller = new AbortController();
    fetchGelaMacRelease(fetch, controller.signal).then(data => { if (data?.version && data?.url) setRelease(data); }).catch(() => {});
    return () => controller.abort();
  }, []);
  const [showDownload, setShowDownload] = useState(false), [mobileMenu, setMobileMenu] = useState(false), [openFaq, setOpenFaq] = useState<number | null>(0);
  useEffect(() => {
    if (reduced) return;
    let api: { destroy: () => void } | undefined, cancelled = false;
    const mount = () => { if (!cancelled && root.current && window.ScrollCraft) api = window.ScrollCraft.mount(root.current); };
    const existing = document.querySelector<HTMLScriptElement>("script[data-scrollcraft]");
    if (window.ScrollCraft) mount();
    else if (existing) existing.addEventListener("load", mount, { once: true });
    else { const script = document.createElement("script"); script.src = "/gelamac/scrollcraft/scrollcraft.js"; script.dataset.scrollcraft = "true"; script.onload = mount; document.body.appendChild(script); }
    return () => { cancelled = true; api?.destroy(); existing?.removeEventListener("load", mount); };
  }, [reduced]);
  const openSettings = () => document.getElementById("seu-jeito")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  return localizeTree(<>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header container"><a className="brand" href="#inicio" aria-label="GelaMac, início"><AppIcon /><span>GelaMac<small>by ALLM4</small></span></a><nav className={mobileMenu ? "desktop-nav mobile-open" : "desktop-nav"} aria-label="Navegação principal"><a href="#como-funciona" onClick={() => setMobileMenu(false)}>Como funciona</a><a href="#seu-jeito" onClick={() => setMobileMenu(false)}>Do seu jeito</a><a href="#duvidas" onClick={() => setMobileMenu(false)}>Dúvidas</a></nav><button className="button header-download" onClick={() => setShowDownload(true)}><span>Baixar para macOS</span><ArrowDownToLine size={16} /></button><button className="mobile-menu-button icon-button" aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileMenu} onClick={() => setMobileMenu(v => !v)}>{mobileMenu ? <X /> : <Menu />}</button></header>
    <main ref={root} id="conteudo" data-motion={reduced ? "reduced" : "full"}>
      <section id="inicio" className="hero container" data-sc-act="flow" aria-labelledby="hero-title"><div className="hero-copy"><span className="hero-eyebrow"><span /> UM RESPIRO PARA O SEU MAC</span><h1 id="hero-title">Seu Mac.<br /><span>De cabeça fria.</span></h1><p>Temperatura à vista. Resfriamento na hora certa.<br className="desktop-break" /> Tudo em um pequeno canto da barra de menus.</p><div className="hero-actions"><button className="button primary" onClick={() => setShowDownload(true)}><ArrowDownToLine size={18} /> Baixar para macOS</button><a className="text-link" href="#como-funciona">Conheça o GelaMac <ArrowUpRight size={17} /></a></div><span className="hero-platform"><Command size={13} /> Nativo para macOS. Feito para ficar por perto.</span></div><Demo onSettings={openSettings} /></section>
      <div className="benefit-strip container"><span><Thermometer /> Temperatura na barra de menus</span><span><Mark /> Duas ventoinhas em conjunto</span><span><ShieldCheck /> Tudo acontece no seu Mac</span></div>
      <section className="quiet-section container" data-sc-act="flow"><p data-sc-in>Você cuida do que está fazendo.<br /><strong>O GelaMac fica de olho na temperatura.</strong></p><span data-sc-in>Discreto quando está tudo bem.<br />Pronto quando o Mac pede um respiro.</span></section>
      <ThermalCycle reduced={reduced} /><ModeLab />
      <section className="everyday-section container" data-sc-act="flow"><div className="everyday-visual" data-sc-reveal="left" data-sc-reveal-at="0.12 0.40"><div className="everyday-menu"><span>Finder <span>Arquivo &nbsp; Editar &nbsp; Visualizar</span></span><span className="everyday-temp"><Mark /> 56°</span></div><div className="everyday-message"><AppIcon size={62} /><span>Pequeno na barra.<br /><strong>Presente quando importa.</strong></span></div><div className="everyday-window"><i /><i /><i /><span>Seu espaço para criar.</span></div></div><div className="everyday-copy" data-sc-in><h2>Seu trabalho continua.<br /><span>O cuidado também.</span></h2><p>A temperatura fica sempre ali, ao lado do ícone. Ao gelar, o símbolo muda e você sabe que o GelaMac está em ação.</p><ul><li><Check /> Aviso discreto na barra de menus</li><li><Check /> Configurações em uma janela própria</li><li><Check /> Opção de iniciar com o macOS</li><li><Check /> Recolha para a barra e libere o Dock</li></ul></div></section>
      <section id="duvidas" className="faq-section container" aria-labelledby="faq-title"><div><span className="section-label">ANTES DE COMEÇAR</span><h2 id="faq-title">Tudo às claras.<br /><span>Até os graus.</span></h2><a className="text-link" href="mailto:suporte@allm4.com">Fale com a ALLM4 <ArrowUpRight size={16} /></a></div><div className="faq-list">{faqs.map(([question, answer], i) => <div key={question} className={`faq-item ${openFaq === i ? "expanded" : ""}`}><h3><button aria-expanded={openFaq === i} aria-controls={`faq-answer-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>{question}{openFaq === i ? <Minus size={18} /> : <Plus size={18} />}</button></h3><div id={`faq-answer-${i}`} hidden={openFaq !== i}><p>{answer}</p></div></div>)}</div></section>
      <section id="baixar" className="download-section container" aria-labelledby="download-title"><div className="download-art" aria-hidden="true"><div /><AppIcon size={172} /><Mark className="download-watermark" /></div><div className="download-copy"><span className="section-label">GELAMAC PARA macOS</span><h2 id="download-title">Dê um respiro<br /><span>para o seu Mac.</span></h2><p>Um app pequeno. Uma preocupação a menos.</p><button className="button primary" onClick={() => setShowDownload(true)}><ArrowDownToLine size={18} /> Baixar para macOS</button><div className="download-meta"><span><Cpu size={14} /> Apple Silicon</span><span>macOS 14+</span><span>Prévia v{release.version}</span></div><small>Validado no MacBook Pro M1 Pro. Requer ventoinhas.<br />A temperatura atingida depende da carga e do ambiente.</small></div></section>
      <InstallationGuide />
    </main>
    <footer className="site-footer container"><a className="footer-brand" href="#inicio"><Mark /> GelaMac <span>by ALLM4</span></a><span>Feito para deixar o Mac respirar.</span><a className="motion-toggle" href={reduced ? "/gelamac/" : "/gelamac/?motion=reduced"}>{reduced ? "Ativar animações" : "Reduzir movimento"}</a><a href="https://allm4.com" target="_blank" rel="noreferrer">Conheça a ALLM4 <ArrowUpRight size={14} /></a></footer>
    {showDownload && <DownloadDialog close={() => setShowDownload(false)} release={release} />}
  </>);
}
