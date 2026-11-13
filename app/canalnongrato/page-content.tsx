"use client";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import { CanalNonGratoReleaseProvider, CanalNonGratoReleaseNote, CanalNonGratoPackageSize } from "./release";
import "./canalnongrato.css";
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
import { Header, ProductDemo, Installation, DownloadLink, Icon, Brand } from "./site-components";
const coverage = [["home", "Página inicial"], ["play", "Recomendações"], ["search", "Pesquisas"], ["shorts", "Shorts"], ["list", "Playlists"]] as const;
const questions = [
    ["O canal some de onde?", "O CanalNonGrato filtra os conteúdos publicados pelo canal na página inicial, nas recomendações ao lado do vídeo, nas pesquisas, nos Shorts e nas playlists. Também impede assistir aos vídeos e acessar a página do canal bloqueado neste navegador."],
    ["Posso mudar de ideia e desbloquear?", "Claro. Abra o CanalNonGrato pelo ícone do navegador, procure o canal na sua lista e clique em Desbloquear. Você também pode exportar e importar sua lista para levar suas escolhas a outro navegador."],
    ["Bloquear um canal também esconde vídeos de outras pessoas sobre ele?", "O bloqueio identifica quem publicou o conteúdo. Vídeos de outros canais que mencionam o mesmo nome continuam aparecendo. Para escondê-los, você pode bloquear esses outros canais também."],
    ["Preciso criar uma conta? E a minha lista?", "Não precisa criar conta no CanalNonGrato. A lista fica salva no armazenamento local da extensão, no perfil do navegador em que você instalou. Ela não é sincronizada com sua conta do YouTube nem enviada a um servidor nosso. As fotos dos canais podem ser carregadas dos servidores do YouTube/Google."],
    ["Funciona no celular?", "Esta versão foi feita para o YouTube no computador, usando Microsoft Edge ou Google Chrome. Não funciona dentro do aplicativo do YouTube para celular."],
    ["Por que a instalação é por um arquivo ZIP?", "Os botões deste site levam ao pacote da última release estável no nosso GitHub. A extensão não está publicada nas lojas do Chrome e do Edge. Você baixa o pacote, extrai a pasta e a carrega no navegador seguindo o guia acima. Mantenha essa pasta no computador; futuras atualizações também são feitas manualmente."],
    ["E se algum conteúdo bloqueado aparecer?", "O YouTube muda seus formatos com frequência. Recarregue a aba depois de instalar ou atualizar a extensão. Se um novo formato escapar do filtro, pode ser necessária uma atualização do CanalNonGrato."],
];
export default function CanalNonGratoPage() {
  useSiteLanguage();
    return localizeTree(<CanalNonGratoReleaseProvider><div className="cng-site" id="cng-inicio">
    <Header />
    <main id="conteudo">
      <section className="cng-hero cng-section-wrap" aria-labelledby="hero-title">
        <div className="cng-hero-copy">
          <p className="cng-eyebrow"><span className="cng-tiny-line"/> MENOS RUÍDO NO SEU YOUTUBE</p>
          <h1 id="hero-title">Seu feed.<br /><em>Suas regras.</em></h1>
          <p className="cng-hero-description">Tem canal que você já cansou de ver.<br className="cng-desktop-break"/> Bloqueie uma vez e abra espaço para o que você gosta.</p>
          <div className="cng-hero-downloads">
            <DownloadLink browser="edge" className="cng-button cng-button-primary"><Icon name="edge"/> Baixar para Edge <Icon name="download"/></DownloadLink>
            <DownloadLink browser="chrome" className="cng-button cng-button-outline"><Icon name="chrome"/> Baixar para Chrome</DownloadLink>
          </div>
          <CanalNonGratoReleaseNote />
          <a href="#instalar" className="cng-text-link cng-hero-help">Instalação manual, com passo a passo <Icon name="arrow"/></a>
        </div>
        <ProductDemo />
        <div className="cng-hero-bottom"><span>VOCÊ ESCOLHE QUEM FICA DE FORA.</span><a href="#como-funciona" aria-label="Conheça como funciona"><Icon name="down"/></a></div>
      </section>
      <section className="cng-coverage" aria-label="Onde o filtro funciona"><div className="cng-section-wrap cng-coverage-inner"><p>O bloqueio vai<br /><strong>além do feed.</strong></p><div className="cng-coverage-items">{coverage.map(([icon, label]) => <span key={label}><Icon name={icon}/>{label}</span>)}</div></div></section>
      <section id="como-funciona" className="cng-how cng-section-wrap" aria-labelledby="how-title">
        <div className="cng-section-heading"><p className="cng-eyebrow">UM CLIQUE MUDA A SUA LISTA</p><h2 id="how-title">Não quer ver?<br /><em>Não precisa ver.</em></h2><p>Sem procurar configurações escondidas.<br />O controle aparece onde você já está.</p></div>
        <div className="cng-how-layout">
          <div className="cng-watch-demo" aria-label="Exemplo do botão Bloquear canal ao lado de Inscrever-se"><div className="cng-watch-art"><span className="cng-orbit cng-orbit-one"/><span className="cng-orbit cng-orbit-two"/><div className="cng-watch-art-center"><Icon name="play"/></div><span className="cng-watch-time">12:34</span></div><div className="cng-watch-info"><span className="cng-preview-tag">EXEMPLO NO YOUTUBE</span><h3>Mais espaço para os seus próximos favoritos.</h3><div className="cng-watch-owner"><span className="cng-channel-avatar cng-avatar-coral">C</span><span>Um canal qualquer<small>Conteúdo do canal</small></span></div><div className="cng-watch-actions"><span className="cng-subscribe-example">Inscrever-se</span><span className="cng-block-example"><Icon name="ban"/> Bloquear canal</span></div><span className="cng-annotation"><Icon name="corner"/> É só clicar aqui.</span></div></div>
          <div className="cng-steps-editorial"><article><span className="cng-step-index">01</span><div><h3>Viu. Bloqueou.</h3><p>Use o botão <strong>Bloquear</strong> nos vídeos ou <strong>Bloquear canal</strong> ao lado de Inscrever-se. Ele já vai para a sua lista.</p></div></article><article><span className="cng-step-index">02</span><div><h3>O canal fica de fora.</h3><p>Vídeos, Shorts, sugestões e resultados publicados por ele são filtrados neste navegador.</p></div></article><article><span className="cng-step-index">03</span><div><h3>Mudou de ideia? Tudo bem.</h3><p>Abra a extensão e desbloqueie quando quiser. Sua lista fica organizada, com nome e foto do canal.</p></div></article></div>
        </div>
      </section>
      <section id="leve" className="cng-lightweight cng-section-wrap" aria-labelledby="light-title"><CanalNonGratoPackageSize /><div className="cng-weight-copy"><p className="cng-eyebrow">PEQUENA NO NAVEGADOR</p><h2 id="light-title">Leve para rodar.<br /><em>Simples de usar.</em></h2><p>Feita para cuidar do seu feed com código enxuto, sem bibliotecas externas na extensão e sem verificações em loop.</p><div className="cng-privacy-points"><span><Icon name="shield"/> Lista salva no navegador</span><span><Icon name="user"/> Sem criar conta</span><span><Icon name="check"/> Sem rastreamento próprio</span></div></div></section>
      <Installation />
      <section className="cng-faq cng-section-wrap" aria-labelledby="faq-title"><div><p className="cng-eyebrow">ANTES DE COMEÇAR</p><h2 id="faq-title">Ficou alguma<br /><em>dúvida?</em></h2><p>O essencial, sem enrolação.</p></div><div className="cng-faq-items">{questions.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus"/></summary><p>{answer}</p></details>)}</div></section>
      <section className="cng-closing cng-section-wrap"><img src={`${publicBasePath}/canalnongrato/brand/canalnongrato.svg`} alt="" width="64" height="64"/><h2>Um pouco mais de paz no feed.</h2><a href="#instalar" className="cng-text-link">Comece com o CanalNonGrato <Icon name="arrow"/></a></section>
    </main>
    <footer className="cng-site-footer cng-section-wrap"><Brand /><p>Seu feed, suas regras. <span>© 2026 CanalNonGrato.</span></p><a className="cng-footer-source" href="https://github.com/Benfic4rthur/CanalNonGrato" target="_blank" rel="noreferrer">Código no GitHub <Icon name="external"/></a><a href={`${publicBasePath}/#extensoes`}>UMA EXTENSÃO <strong>ALLM4</strong><Icon name="external"/></a></footer>
  </div></CanalNonGratoReleaseProvider>);
}
