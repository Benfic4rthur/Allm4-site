import type { Metadata } from "next";
import Image from "next/image";
import { Apple, ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Check, Clock3, Code2, Gauge, Layers3, MessageSquare, Monitor, ShieldCheck } from "lucide-react";
import { CodexResetActivityMark, CodexResetCustomizer, CodexResetDemo, CodexResetInstallCommand } from "@/components/brand/codex-reset-experience";
import { CodexResetDownloadOptions, CodexResetReleaseProvider, CodexResetVersion } from "@/components/brand/codex-reset-release";
import { codexResetLinks } from "@/lib/codex-reset";
import "./codex-reset.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "Codex Reset — Seu Codex, sempre à vista | ALLM4";
const description = "Sua franquia do Codex, as conversas ativas e o tempo até a renovação no topo do Mac. Codex Reset é gratuito para Apple Silicon e Intel.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/codex-reset/" },
  icons: { icon: [{ url: `${basePath}/products/codex-reset-icon.png`, type: "image/png" }] },
  openGraph: { title, description, url: "/codex-reset/", type: "website", locale: "pt_BR", siteName: "ALLM4", images: [{ url: "/codex-reset/share.png", width: 1200, height: 630, alt: "Codex Reset — Sua franquia do Codex, sempre à vista" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/codex-reset/share.png"] },
};

const questions = [
  { question: "O Codex Reset é gratuito?", answer: "Sim. O Codex Reset é gratuito para baixar e usar. Ele usa a conta do Codex já conectada no seu Mac, sem cadastro extra ou chave de API separada." },
  { question: "O Codex Reset renova ou aumenta minha franquia?", answer: "Ele acompanha a franquia e as renovações da sua conta. Não altera limites, não força resets e não interfere no plano. A renovação semanal é informada pelo próprio Codex; o reset extra é uma estimativa histórica apresentada separadamente." },
  { question: "Funciona no meu Mac?", answer: "O monitor requer macOS 14 ou posterior e tem instaladores para Apple Silicon e Intel. Também precisa do Codex Desktop compatível com seu Mac, instalado e autenticado na sua conta. O tipo de tela é detectado automaticamente: com notch, o painel se integra ao recorte; sem notch, aparece em uma cápsula compacta na barra de menus." },
  { question: "A previsão de reset extra é garantida?", answer: "Não. Ela é calculada com os intervalos entre resets dos últimos 30 dias publicados em codex-resets.com, a partir do último reset observado. São necessários pelo menos seis intervalos válidos; com poucos dados, o monitor sinaliza a limitação. É uma estimativa histórica, sem promessa de renovação e sem aviso antecipado da OpenAI." },
  { question: "O app lê o que eu converso com o Codex?", answer: "O monitor consulta a franquia pela conexão local com o Codex e usa metadados locais das conversas, como projeto, modelo e estado de atividade. Não lê o conteúdo das mensagens nem envia suas conversas a um servidor do projeto. Não exige uma chave de API separada." },
  { question: "Ele funciona sem internet?", answer: "O painel é nativo e suas preferências ficam neste Mac. O Codex usa sua própria conexão para consultar a conta, e o monitor consulta a fonte pública de resets para obter o histórico. Não há telemetria ou servidor próprio. A tradução opcional de anúncios usa o recurso do macOS 15 ou posterior." },
  { question: "Como recebo as próximas versões?", answer: "Os downloads desta página acompanham a última release estável publicada no GitHub. Para atualizar, encerre o Codex Reset pelo botão de desligar do painel, substitua a cópia em Aplicativos e abra a nova versão. O aplicativo não possui atualizador automático." },
];

export default function CodexResetPage() {
  return <CodexResetReleaseProvider><div className="cr-site" id="codex-reset-topo">
    <a className="cr-skip" href="#cr-conteudo">Pular para o conteúdo</a>
    <header className="cr-header cr-wrap">
      <a className="cr-brand" href="#codex-reset-topo" aria-label="Codex Reset, início"><Image src={`${basePath}/products/codex-reset-icon.png`} alt="" width={40} height={40} unoptimized /><span>Codex Reset</span></a>
      <nav aria-label="Navegação do Codex Reset"><a href="#o-monitor">O monitor</a><a href="#seu-painel">Do seu jeito</a><a href="#duvidas">Dúvidas</a></nav>
      <a className="cr-header-download" href="#baixar">Baixar grátis <ArrowDownToLine size={14} aria-hidden="true" /></a>
    </header>

    <main id="cr-conteudo">
      <section className="cr-hero cr-wrap" aria-labelledby="cr-title">
        <div className="cr-hero-copy">
          <p className="cr-eyebrow">SEU RITMO DE TRABALHO, À VISTA.</p>
          <h1 id="cr-title">Seu Codex.<br /><span>Sempre<br />{" "}à vista.</span></h1>
          <p className="cr-hero-intro">Quanto ainda dá para criar?<br />{" "}Sua franquia, as conversas em andamento e a próxima renovação. Tudo ali, no topo do seu Mac.</p>
          <div className="cr-hero-actions"><a className="cr-button" href="#baixar">Baixar grátis para Mac <ArrowDownToLine size={17} aria-hidden="true" /></a><a className="cr-text-link" href="#o-monitor">Conheça o monitor <ArrowDown size={14} aria-hidden="true" /></a></div>
          <p className="cr-hero-meta"><Apple size={13} aria-hidden="true" /><span>macOS 14+</span><span>Apple Silicon · Intel</span><span>Gratuito para usar</span></p>
        </div>
        <CodexResetDemo />
      </section>

      <div className="cr-proof-bar"><div className="cr-wrap"><span><Gauge size={16} strokeWidth={1.5} aria-hidden="true" /> Sua franquia, em tempo de uso</span><span><Monitor size={16} strokeWidth={1.5} aria-hidden="true" /> Com notch ou sem</span><span><ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" /> Sem conta extra ou telemetria</span><a href={codexResetLinks.repository} target="_blank" rel="noopener noreferrer"><Code2 size={15} aria-hidden="true" /> Código público <ArrowUpRight size={12} aria-hidden="true" /></a></div></div>

      <section className="cr-overview cr-wrap" id="o-monitor" aria-labelledby="cr-overview-title">
        <div className="cr-section-heading"><div><p className="cr-eyebrow">01 / NO TOPO DO SEU DIA</p><h2 id="cr-overview-title">Continue no fluxo.<br /><span>O resto fica à vista.</span></h2></div><p>Você não precisa abrir outra janela só para conferir sua franquia. Um olhar acompanha o que está acontecendo.</p></div>
        <div className="cr-feature-grid">
          <article className="cr-feature"><div className="cr-feature-art cr-feature-art--quota" aria-hidden="true"><span>87<small>%</small></span><i><b /></i><small>DA SEMANA AINDA DISPONÍVEL</small></div><p className="cr-feature-index">01 / FRANQUIA</p><h3>Saiba quanto ainda tem.</h3><p>A porcentagem semanal restante vem da sua própria conta, com atualização a cada 30 segundos.</p></article>
          <article className="cr-feature"><div className="cr-feature-art cr-feature-art--activity"><CodexResetActivityMark /><span aria-hidden="true"><MessageSquare size={13} /> Seu projeto <small>Modelo ativo · Alto</small></span></div><p className="cr-feature-index">02 / ATIVIDADE</p><h3>Acompanhe o que está rodando.</h3><p>Projeto, modelo, esforço e conversas em andamento. Escolha as informações que fazem sentido para você.</p></article>
          <article className="cr-feature"><div className="cr-feature-art cr-feature-art--reset" aria-hidden="true"><Clock3 size={19} strokeWidth={1.3} /><span>6<small>d</small> 17<small>h</small></span><small>ATÉ A RENOVAÇÃO SEMANAL</small></div><p className="cr-feature-index">03 / RENOVAÇÃO</p><h3>Tenha a próxima em mente.</h3><p>Veja a contagem para o reset semanal e acompanhe, à parte, a janela estimada de reset extra.</p></article>
        </div>
        <div className="cr-forecast-note"><span><Clock3 size={16} aria-hidden="true" /> Duas informações. Duas fontes.</span><p>A renovação semanal é informada pela sua conta. O reset extra é uma estimativa do histórico de <a href="https://codex-resets.com/" target="_blank" rel="noopener noreferrer">codex-resets.com <ArrowUpRight size={11} aria-hidden="true" /></a>, sujeita a variações.</p></div>
      </section>

      <section className="cr-custom-section" id="seu-painel" aria-labelledby="cr-custom-title"><div className="cr-wrap cr-custom-grid"><div className="cr-custom-copy"><p className="cr-eyebrow">02 / ORGANIZE DO SEU JEITO</p><h2 id="cr-custom-title">Um pequeno espaço.<br /><span>O seu jeito de usar.</span></h2><p>Só a porcentagem? Projeto e modelo? Ou seus resets e ritmo de processamento? Monte um painel com o que você quer acompanhar.</p><ul><li><Layers3 size={17} aria-hidden="true" /> Duas linhas de atividade e três de detalhes.</li><li><Check size={17} aria-hidden="true" /> Campos, ordem e medidas ajustáveis.</li><li><Check size={17} aria-hidden="true" /> Português, inglês ou espanhol.</li></ul><p className="cr-custom-footnote">Tudo salvo neste Mac. O monitor acompanha a abertura e o encerramento do Codex Desktop.</p></div><CodexResetCustomizer /></div></section>

      <section className="cr-download-section cr-wrap" id="baixar" aria-labelledby="cr-download-title"><div className="cr-download-heading"><Image src={`${basePath}/products/codex-reset-icon.png`} alt="" width={76} height={76} unoptimized /><p className="cr-eyebrow">03 / UM NOVO COMPANHEIRO DE TRABALHO</p><h2 id="cr-download-title">Leve o seu ritmo<br /><span>para o topo.</span></h2><p>Gratuito para baixar e usar. Escolha o processador do seu Mac.<br />Os dois downloads acompanham a última versão no GitHub.</p><div className="cr-version-line"><CodexResetVersion /><a href={codexResetLinks.releases} target="_blank" rel="noopener noreferrer">Ver novidades <ArrowUpRight size={12} aria-hidden="true" /></a></div></div>
        <CodexResetDownloadOptions />
        <p className="cr-requirements">Requer macOS 14 ou posterior e Codex Desktop compatível, instalado e autenticado na sua conta.<br />Para conferir seu processador:  → Sobre Este Mac.</p>
        <div className="cr-install" id="instalar"><div className="cr-install-copy"><p className="cr-eyebrow">PRIMEIRA ABERTURA</p><h3>Baixou?<br />Falta só um passo.</h3><p>Esta versão ainda não tem assinatura Developer ID nem notarização da Apple. Depois de copiar o app, o comando ao lado libera sua abertura no macOS.</p><a className="cr-text-link" href={codexResetLinks.guide} target="_blank" rel="noopener noreferrer">Guia completo no GitHub <ArrowUpRight size={13} aria-hidden="true" /></a></div><div className="cr-install-content"><ol><li><span>1</span><p>Abra o DMG e arraste <strong>Codex Reset.app</strong> para <strong>Aplicativos</strong>.</p></li><li><span>2</span><p>Copie o comando, cole no <strong>Terminal</strong> e pressione Enter.</p></li><li><span>3</span><p>Abra o <strong>Codex Reset</strong> e o <strong>Codex Desktop</strong>. O monitor aparece no topo da tela.</p></li></ol><CodexResetInstallCommand /></div></div>
      </section>

      <section className="cr-faq-section" id="duvidas" aria-labelledby="cr-faq-title"><div className="cr-wrap cr-faq-grid"><div><p className="cr-eyebrow">04 / BOM SABER</p><h2 id="cr-faq-title">Tudo claro.<br /><span>Antes de começar.</span></h2><p>Um aplicativo independente da ALLM4, feito para acompanhar o seu Codex. Sem vínculo oficial com a OpenAI.</p><a className="cr-text-link" href={codexResetLinks.privacy} target="_blank" rel="noopener noreferrer"><ShieldCheck size={15} aria-hidden="true" /> Como seus dados são tratados <ArrowUpRight size={12} aria-hidden="true" /></a></div><div className="cr-questions">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="cr-closing cr-wrap"><Image className="cr-closing-logo" src={`${basePath}/products/codex-reset-icon.png`} alt="Codex Reset" width={88} height={88} unoptimized /><p>MENOS IDAS E VINDAS. MAIS CONTINUIDADE.</p><h2>Seu próximo projeto<br /><span>merece o seu foco.</span></h2><a className="cr-button" href="#baixar">Baixar Codex Reset grátis <ArrowRight size={17} aria-hidden="true" /></a></section>
    </main>
    <footer className="cr-footer cr-wrap"><a className="cr-family" href={`${basePath}/`}><Image src={`${basePath}/brand/allm4-mark.svg`} alt="" width={25} height={25} unoptimized /><span>Uma criação <strong>ALLM4</strong></span><ArrowUpRight size={12} aria-hidden="true" /></a><span>Software para uma vida mais simples.</span><a href={codexResetLinks.repository} target="_blank" rel="noopener noreferrer">Codex Reset no GitHub <ArrowUpRight size={13} aria-hidden="true" /></a></footer>
  </div></CodexResetReleaseProvider>;
}
