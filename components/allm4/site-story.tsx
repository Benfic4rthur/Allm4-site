import { ArrowDown, ArrowUpRight, Check, Image as ImageIcon, MessageSquare, FolderCode, MonitorPlay } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/** Intentional editorial placeholder. Never impersonates a real product result. */
export function MediaPlaceholder({ title, description, video = false, compact = false }: {
  title: string;
  description: string;
  video?: boolean;
  compact?: boolean;
}) {
  const Icon = video ? MonitorPlay : ImageIcon;
  return (
    <figure className={`media-placeholder${compact ? " media-placeholder-compact" : ""}`} aria-label={`${video ? "Vídeo" : "Foto"} a produzir: ${title}`}>
      <span className="media-placeholder-tag">ESPAÇO RESERVADO</span>
      <Icon size={34} strokeWidth={1.25} aria-hidden="true" />
      <figcaption><strong>{video ? "Vídeo" : "Foto"} de {title}</strong><span>{description}</span></figcaption>
      <small>Substituir pelo material real do Allm4.</small>
    </figure>
  );
}

const choices = [
  { icon: MessageSquare, number: "01", title: "Converse e resolva", text: "Escreva um texto, entenda um documento ou organize uma ideia.", href: "#recursos", label: "Conhecer o Chat" },
  { icon: ImageIcon, number: "02", title: "Dê forma às ideias", text: "Descreva a imagem que imaginou e explore novas versões.", href: "#imagens", label: "Ver criação de imagens" },
  { icon: FolderCode, number: "03", title: "Construa junto com a IA", text: "Crie e melhore sites e projetos, com revisão das alterações.", href: "#projetos", label: "Conhecer Projetos" },
];

export function QuickChoices() {
  return (
    <section className="quick-choices wrap" aria-label="O que você pode fazer com o Allm4">
      {choices.map(({ icon: Icon, ...item }) => (
        <a key={item.number} href={item.href} className="quick-choice">
          <div className="quick-choice-top"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /><span>{item.number}</span></div>
          <h2>{item.title}</h2><p>{item.text}</p>
          <span className="quick-choice-link">{item.label}<ArrowDown size={15} aria-hidden="true" /></span>
        </a>
      ))}
    </section>
  );
}

export function ImageShowcase() {
  return (
    <section className="section image-story" id="imagens" aria-labelledby="images-title">
      <div className="wrap story-layout">
        <div className="story-copy reveal">
          <div className="eyebrow">DA SUA DESCRIÇÃO À IMAGEM</div>
          <h2 id="images-title">Uma ideia na cabeça.<br /><span className="muted-heading">Uma imagem na tela.</span></h2>
          <p className="section-intro">Você descreve o que gostaria de ver. No ambiente Imagem, o Allm4 gera o resultado e permite explorar variações, sem precisar montar ferramentas separadas.</p>
          <div className="example-request"><span>EXEMPLO DE PEDIDO</span><p>“Crie uma ilustração de uma cafeteria aconchegante, com a luz do fim da tarde entrando pela janela.”</p></div>
          <ul className="story-benefits">
            <li><Check size={16} aria-hidden="true" /> Peça por texto ou use sua voz.</li>
            <li><Check size={16} aria-hidden="true" /> Explore variações da sua ideia.</li>
            <li><Check size={16} aria-hidden="true" /> Mantenha pedidos e resultados no histórico.</li>
          </ul>
          <p className="fine-print">A qualidade e o tempo de geração dependem da IA escolhida e do computador. Imagens podem exigir mais recursos que uma conversa.</p>
          <a className="text-button" href="#download">Começar minha primeira imagem <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="story-visual reveal">
          <MediaPlaceholder title="uma imagem criada no Allm4" description="Mostrar a ilustração da cafeteria gerada a partir do pedido ao lado. Dar destaque ao resultado, não a uma captura inteira da tela." />
        </div>
      </div>
    </section>
  );
}

const questions = [
  { question: "Nunca usei IA. Vou conseguir começar?", answer: "O Allm4 foi pensado para guiar o começo: você instala o aplicativo, usa o assistente para analisar seu computador e escolhe uma IA entre as recomendações. Não é necessário configurar cada ferramenta separadamente. As orientações de instalação estão nesta página." },
  { question: "O que significa a IA ser local?", answer: "Significa que o modelo pode trabalhar no seu próprio computador, em vez de enviar cada pedido para processamento em um servidor. Downloads, atualizações, licenciamento e recursos conectados ainda podem usar a internet." },
  { question: "Funciona no meu computador?", answer: "O site oferece instaladores para Windows e macOS Apple Silicon (Macs com chips M1 ou posteriores, não Intel). O assistente do aplicativo analisa a máquina para recomendar modelos. A velocidade e os recursos disponíveis variam: imagens e projetos podem exigir mais memória e processamento que o Chat." },
  { question: "Preciso ficar conectado à internet?", answer: "Você precisa de conexão para baixar o aplicativo e os modelos. Depois da instalação, muitas tarefas com modelos locais funcionam sem internet. Ativação da licença, atualizações, downloads e recursos conectados podem continuar precisando de conexão." },
  { question: "É grátis? Tem mensalidade?", answer: "Existe um período de uso gratuito com limite. Ao atingir esse limite, o aplicativo informa as condições para liberar o acesso com pagamento único, sem assinatura. A licença permite até 3 computadores e inclui futuras atualizações. Confira o valor e o limite apresentados dentro do Allm4 antes da compra." },
  { question: "Projetos é só uma conversa sobre programação?", answer: "Não. O Allm4 pode trabalhar nos arquivos do projeto: explorar, criar, editar, explicar código e ajudar a corrigir problemas. Você pode aceitar as mudanças, pedir ajustes ou descartá-las. O alcance depende da IA, do computador e da tarefa; o resultado ainda precisa da sua revisão." },
  { question: "O Auto Repair conserta qualquer problema sozinho?", answer: "Não. Ele trata falhas internas elegíveis do Allm4, com envio de diagnóstico técnico sanitizado e um fluxo de análise e correção. A equipe revisa e autoriza as novas versões. Não é uma ferramenta de reparo do Windows ou do Mac, nem uma garantia de correção imediata." },
];

export function SiteQuestions() {
  return (
    <section className="section wrap site-questions" id="duvidas" aria-labelledby="questions-title">
      <div className="questions-heading"><div className="eyebrow">ANTES DO PRIMEIRO CLIQUE</div><h2 id="questions-title">Pode perguntar.</h2><p className="section-intro">As respostas que você precisa para começar com tranquilidade.</p><a className="text-button" href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer">Falar com o Allm4 <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      <div className="questions-list">{questions.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
    </section>
  );
}
