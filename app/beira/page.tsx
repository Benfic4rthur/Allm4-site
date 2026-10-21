import type { Metadata } from "next";
import Image from "next/image";
import { Apple, ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Check, Fingerprint, Keyboard, MousePointer2, MoveVertical, SlidersHorizontal, Sun, Volume2 } from "lucide-react";
import { InstallationCommand, TrackpadDemo } from "@/components/brand/beira-experience";
import { BeiraDownloadOptions, BeiraReleaseProvider, BeiraVersion } from "@/components/brand/beira-release";
import { beiraLinks } from "@/lib/beira";
import "./beira.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "Beira — Brilho e volume na ponta dos dedos | ALLM4";
const description = "Controle o brilho e o volume do Mac com gestos nas bordas do trackpad. Conheça o Beira, experimente a demonstração e baixe gratuitamente para Apple Silicon ou Intel.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/beira/" },
  icons: { icon: [{ url: `${basePath}/products/beira-icon.svg`, type: "image/svg+xml" }] },
  openGraph: { title, description, url: "/beira/", siteName: "ALLM4", type: "website", locale: "pt_BR", images: [{ url: "/beira/share.png", width: 1200, height: 630, alt: "Beira — brilho e volume na ponta dos dedos" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/beira/share.png"] },
};

const features = [
  { icon: Fingerprint, title: "Um toque de retorno.", text: "Um pulso tátil discreto acompanha o ajuste em trackpads Force Touch compatíveis. Você sente o gesto acontecer." },
  { icon: SlidersHorizontal, title: "Encontre a sua medida.", text: "Ajuste a largura das bordas de 1% a 8%, a sensibilidade e os lados. O gesto se adapta ao seu jeito de usar." },
  { icon: Keyboard, title: "Pensado para a rotina.", text: "Ative a proteção ao digitar, exija a tecla Option para usar ou limite o início do gesto à parte inferior do trackpad." },
];

const questions = [
  { question: "É gratuito mesmo?", answer: "Sim. O Beira é gratuito para baixar e usar, sem assinatura, conta ou período de teste. Os downloads são distribuídos pelas releases do repositório no GitHub." },
  { question: "Meu Mac é compatível?", answer: "O Beira requer macOS 13 Ventura ou superior e um trackpad compatível. Há versões para Apple Silicon e Intel. O uso principal é no trackpad integrado do MacBook; o funcionamento inicial foi confirmado em um MacBook Pro com Apple Silicon. A versão Intel foi compilada separadamente, mas ainda não foi validada em hardware Intel. Trackpads externos também precisam de validação." },
  { question: "Vou perder as bordas do meu trackpad?", answer: "O Beira reconhece gestos que começam na faixa lateral e seguem na vertical. Movimentos iniciados no centro ou na horizontal continuam disponíveis ao ponteiro. Um segundo dedo cancela o ajuste, e um gesto cancelado só pode recomeçar depois que os dedos forem levantados. A largura da faixa é configurável." },
  { question: "Por que preciso usar o Terminal e dar uma permissão?", answer: "A versão atual não tem certificado de distribuição nem notarização da Apple. O comando indicado na instalação remove a quarentena apenas do Beira em Aplicativos. A permissão de Acessibilidade é uma etapa separada: ela permite enviar os controles de brilho e volume ao macOS." },
  { question: "Funciona com qualquer tela e saída de áudio?", answer: "O Beira envia os controles equivalentes às teclas de sistema. A resposta depende da tela e da saída de áudio em uso. Dispositivos com volume fixo podem não responder, e o controle DDC de monitores externos não está incluído. O retorno tátil requer um trackpad com Force Touch." },
  { question: "O Beira coleta meus dados?", answer: "O app funciona localmente, sem conta, telemetria ou chamadas de rede. Não armazena os toques nem o conteúdo digitado. Ele usa a API privada MultitouchSupport para ler o trackpad, e futuras atualizações do macOS podem exigir ajustes de compatibilidade." },
];

export default function BeiraPage() {
  return (
    <BeiraReleaseProvider><div className="beira-site" id="beira-topo">
      <a className="beira-skip" href="#beira-conteudo">Pular para o conteúdo</a>
      <header className="beira-header beira-wrap">
        <a className="beira-brand" href="#beira-topo" aria-label="Beira, início"><Image src={`${basePath}/products/beira-icon.svg`} alt="" width={42} height={42} unoptimized /><span>Beira</span></a>
        <nav aria-label="Navegação do Beira"><a href="#como-funciona">O gesto</a><a href="#seu-jeito">Seu jeito</a><a href="#instalar">Instalação</a></nav>
        <a className="beira-nav-download" href="#baixar">Baixar grátis <ArrowDownToLine size={15} aria-hidden="true" /></a>
      </header>

      <main id="beira-conteudo">
        <section className="beira-hero beira-wrap" aria-labelledby="beira-title">
          <div className="beira-hero-copy">
            <p className="beira-eyebrow">UM PEQUENO APP. UM GESTO NATURAL.</p>
            <h1 id="beira-title">Brilho e volume.<br /><span>Na ponta<br />dos dedos.</span></h1>
            <p className="beira-hero-intro">As bordas do seu trackpad ganharam uma nova função. Deslize para ajustar o Mac, sem tirar a mão de onde ela já está.</p>
            <div className="beira-actions"><a className="beira-button" href="#baixar">Conheça seu próximo gesto <ArrowDown size={17} aria-hidden="true" /></a><a className="beira-text-link" href={beiraLinks.repository} target="_blank" rel="noopener noreferrer">No GitHub <ArrowUpRight size={13} aria-hidden="true" /></a></div>
            <p className="beira-hero-meta"><Apple size={14} aria-hidden="true" /> Feito para macOS <span>Apple Silicon + Intel</span><span>Grátis</span><BeiraVersion /></p>
          </div>
          <TrackpadDemo />
        </section>

        <div className="beira-ribbon"><div className="beira-wrap"><span><Check size={14} aria-hidden="true" /> Nativo para Mac</span><span><Check size={14} aria-hidden="true" /> Sem conta ou assinatura</span><span><Check size={14} aria-hidden="true" /> Sem telemetria</span><span><Check size={14} aria-hidden="true" /> Na barra de menus</span></div></div>

        <section className="beira-how beira-light" id="como-funciona" aria-labelledby="beira-how-title">
          <div className="beira-wrap">
            <div className="beira-section-heading"><p className="beira-eyebrow">01 / O GESTO</p><h2 id="beira-how-title">Duas bordas.<br /><span>Uma ideia simples.</span></h2><p>A música ficou alta? A tela pediu mais luz?<br />Um movimento resolve.</p></div>
            <div className="beira-gesture-grid">
              <article className="beira-gesture beira-gesture--volume"><span className="beira-gesture-number">01</span><div className="beira-gesture-art" aria-hidden="true"><div className="beira-mini-pad"><i className="beira-mini-edge beira-mini-edge--left" /><Volume2 size={32} strokeWidth={1.2} /><span className="beira-mini-travel">↕</span></div></div><h3>À esquerda, o som.</h3><p>Deslize para cima para aumentar o volume. Para baixo, deixe a música mais baixinha.</p><span className="beira-gesture-tag">BORDA ESQUERDA · VOLUME</span></article>
              <article className="beira-gesture beira-gesture--brightness"><span className="beira-gesture-number">02</span><div className="beira-gesture-art" aria-hidden="true"><div className="beira-mini-pad"><i className="beira-mini-edge beira-mini-edge--right" /><Sun size={35} strokeWidth={1.2} /><span className="beira-mini-travel">↕</span></div></div><h3>À direita, a luz.</h3><p>Mais brilho para enxergar melhor. Menos brilho para aquele fim de noite. Na mesma direção do gesto.</p><span className="beira-gesture-tag">BORDA DIREITA · BRILHO</span></article>
              <article className="beira-gesture beira-gesture--center"><span className="beira-gesture-number">03</span><div className="beira-gesture-art" aria-hidden="true"><div className="beira-mini-pad"><MousePointer2 size={30} strokeWidth={1.2} /><span className="beira-center-trail" /></div></div><h3>No meio, sua rotina.</h3><p>O gesto precisa começar na borda e seguir na vertical. Movimentos iniciados no centro ou na horizontal seguem com o ponteiro.</p><span className="beira-gesture-tag">CENTRO LIVRE · INTENÇÃO VERTICAL</span></article>
            </div>
            <div className="beira-full-travel"><MoveVertical size={28} strokeWidth={1.3} aria-hidden="true" /><p><strong>De ponta a ponta. Do mínimo ao máximo.</strong><span>Uma passada completa pela borda leva o controle até o extremo. Dois dedos cancelam o ajuste.</span></p></div>
          </div>
        </section>

        <section className="beira-personal beira-wrap" id="seu-jeito" aria-labelledby="beira-personal-title">
          <div className="beira-personal-heading"><p className="beira-eyebrow">02 / DO SEU JEITO</p><h2 id="beira-personal-title">Discreto na barra.<br /><span>Presente no gesto.</span></h2><p>O Beira fica na barra de menus. Você decide como ele entra na sua rotina: mais sensível, com uma borda menor ou só quando quiser.</p></div>
          <div className="beira-menu-illustration" aria-label="Ilustração do ícone do Beira na barra de menus"><div className="beira-menu-bar"><span>Barra de menus do macOS</span><span className="beira-menu-spacer" /><span className="beira-menubar-icon">[ ]</span><span>Ícone do Beira</span></div><div className="beira-menu-popover"><span className="beira-menu-app">Beira<span>Pronto para deslizar</span></span><div className="beira-menu-control"><Volume2 size={16} /><span>Seu som</span><span className="beira-menu-track"><i /></span></div><div className="beira-menu-control"><Sun size={16} /><span>Sua luz</span><span className="beira-menu-track"><i /></span></div><p>Seu gesto. Seu ritmo.</p></div><span className="beira-illustration-caption">O ícone na barra de menus dá acesso aos ajustes</span></div>
          <div className="beira-feature-grid">{features.map(({ icon: Icon, title: featureTitle, text }) => <article key={featureTitle}><Icon size={27} strokeWidth={1.3} aria-hidden="true" /><h3>{featureTitle}</h3><p>{text}</p></article>)}</div>
          <p className="beira-personal-note">Também dá para ativar ajustes finos, manter o cursor no lugar durante o gesto e abrir o Beira ao iniciar o Mac. Pause pela barra de menus quando precisar; fechar a janela de ajustes mantém o app em execução.</p>
        </section>

        <section className="beira-download beira-light" id="baixar" aria-labelledby="beira-download-title"><div className="beira-wrap">
          <div className="beira-download-heading"><p className="beira-eyebrow">03 / LEVE PARA O SEU MAC</p><h2 id="beira-download-title">Um gesto a mais.<br /><span>Zero mensalidades.</span></h2><p>Gratuito, sem cadastro e sem complicar.<br />Escolha a versão para o seu processador.</p></div>
          <BeiraDownloadOptions />
          <p className="beira-download-version"><BeiraVersion /></p>
          <div className="beira-download-notes"><p>macOS 13 ou superior · Trackpad compatível<br />Veja seu chip em  → Sobre Este Mac.</p><a href={beiraLinks.releases} target="_blank" rel="noopener noreferrer">Downloads e versões no GitHub <ArrowUpRight size={15} aria-hidden="true" /></a></div>
          <p className="beira-compatibility">Versão inicial: funcionamento confirmado em MacBook Pro com Apple Silicon. A versão Intel ainda precisa de validação em hardware Intel. Retorno tátil disponível em trackpads Force Touch compatíveis.</p>
        </div></section>

        <section className="beira-install beira-wrap" id="instalar" aria-labelledby="beira-install-title"><div className="beira-install-intro"><p className="beira-eyebrow">04 / PRIMEIRO ENCONTRO</p><h2 id="beira-install-title">Baixou?<br /><span>Falta só um instante.</span></h2><p>Esta versão não tem certificado de distribuição nem notarização da Apple. Estes passos liberam a abertura e o controle do Mac.</p></div><ol className="beira-install-steps"><li><span className="beira-step-number">1</span><div><h3>Coloque em Aplicativos.</h3><p>Extraia o ZIP e arraste <strong>Beira.app</strong> para a pasta Aplicativos.</p></div></li><li><span className="beira-step-number">2</span><div><h3>Libere a primeira abertura.</h3><p>Abra o Terminal, cole este comando e pressione Enter.</p><InstallationCommand /></div></li><li><span className="beira-step-number">3</span><div><h3>Permita e comece a deslizar.</h3><p>Abra o Beira. Em Ajustes do Sistema → Privacidade e Segurança → Acessibilidade, permita o acesso. No app, confira o status <strong>Pronto para deslizar</strong>.</p><a className="beira-text-link" href={beiraLinks.guide} target="_blank" rel="noopener noreferrer">Ver o guia completo <ArrowUpRight size={14} aria-hidden="true" /></a></div></li></ol></section>

        <section className="beira-faq beira-light" id="duvidas" aria-labelledby="beira-faq-title"><div className="beira-wrap beira-faq-grid"><div><p className="beira-eyebrow">05 / BOM SABER</p><h2 id="beira-faq-title">Antes do<br /><span>primeiro gesto.</span></h2><a href={beiraLinks.issues} className="beira-text-link" target="_blank" rel="noopener noreferrer">Precisa de ajuda? <ArrowUpRight size={15} aria-hidden="true" /></a></div><div className="beira-questions">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

        <section className="beira-closing beira-wrap"><Image src={`${basePath}/products/beira-icon.svg`} alt="" width={68} height={68} unoptimized /><h2>Está nas suas mãos.<br /><span>Ou melhor, nos seus dedos.</span></h2><a className="beira-button" href="#baixar">Baixar o Beira <ArrowRight size={17} aria-hidden="true" /></a></section>
      </main>

      <footer className="beira-footer beira-wrap"><a className="beira-family" href={`${basePath}/`}><Image src={`${basePath}/brand/allm4-mark.svg`} alt="" width={25} height={25} unoptimized /><span>Uma criação <strong>ALLM4</strong></span><ArrowUpRight size={13} aria-hidden="true" /></a><span>Feito para deixar o seu dia mais simples.</span><a href={beiraLinks.repository} target="_blank" rel="noopener noreferrer">Beira no GitHub <ArrowUpRight size={13} aria-hidden="true" /></a></footer>
    </div></BeiraReleaseProvider>
  );
}
