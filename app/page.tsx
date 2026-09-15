import {
  ArrowUpRight,
  ArrowDown,
  Download,
  Sparkles,
  ShieldCheck,
  Cpu,
  Apple,
  Monitor,
  Boxes,
  MessageSquare,
  Check,
  Terminal,
  LockKeyhole,
  HardDrive,
  ArrowRight,
} from "lucide-react";
import { Brand, CTA, AppScreenshot } from "@/components/allm4/ui";
import { FeatureExplorer } from "@/components/allm4/feature-explorer";
import {
  ModelAssistant,
  ModelControls,
} from "@/components/allm4/model-controls";
import { Downloads } from "@/components/allm4/downloads";
import { Footer } from "@/components/allm4/footer";
import { MotionRoot } from "@/components/allm4/motion";
const steps = [
  {
    number: "01",
    icon: Boxes,
    title: "Encontre seu modelo.",
    text: "Explore o catálogo ou deixe o assistente sugerir as melhores opções para o seu computador.",
    label: "VOCÊ ESCOLHE",
    art: "choose",
  },
  {
    number: "02",
    icon: Download,
    title: "Deixe o Allm4 preparar.",
    text: "Baixe e gerencie os modelos pela interface. Sem terminal, comandos ou configurações manuais para começar.",
    label: "O ALLM4 SIMPLIFICA",
    art: "prepare",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Comece a conversa.",
    text: "Transforme ideias em textos, traga seus documentos e explore possibilidades com uma IA no seu desktop.",
    label: "SUAS IDEIAS GANHAM ESPAÇO",
    art: "chat",
  },
];
export default function Home() {
  return (
    <MotionRoot>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="header wrap" id="inicio">
        <Brand label />
        <nav aria-label="Navegação principal">
          <a href="#recursos">Produto</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#privacidade">Privacidade</a>
        </nav>
        <CTA small />
      </header>
      <main id="conteudo">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> INTELIGÊNCIA ARTIFICIAL. REALMENTE
              SUA.
            </div>
            <h1 id="hero-title">
              Sua IA.
              <br />
              No seu computador.
              <br />
              <span>Sob seu controle.</span>
            </h1>
            <p>
              Transforme seu computador em um ambiente próprio de inteligência
              artificial. Simples de usar. Livre para escolher. Feito para você.
            </p>
            <div className="hero-actions">
              <CTA />
              <a className="text-button" href="#como-funciona">
                Descobrir como funciona <ArrowDown size={16} />
              </a>
            </div>
            <div className="platform-note">
              <Apple size={15} />
              <span>macOS Apple Silicon</span>
              <span className="dot-divider" />
              <Monitor size={15} />
              <span>Windows</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="core">
              <Sparkles />
            </div>
            <span className="orbit-label">PROCESSAMENTO LOCAL</span>
            <span className="orbit-point" />
          </div>
          <div className="product-stage" id="produto">
            <div className="stage-top">
              <span>
                <span className="status-dot" /> UM NOVO ESPAÇO PARA SUAS IDEIAS
              </span>
              <span>
                ALLM4 DESKTOP <ArrowUpRight size={12} />
              </span>
            </div>
            <AppScreenshot />
            <div className="floating-chip">
              <div className="chip-icon">
                <Cpu size={20} />
              </div>
              <div>
                <strong>O poder está aqui.</strong>
                <span>No seu próprio computador.</span>
              </div>
              <span className="status-dot" />
            </div>
          </div>
        </section>
        <div className="trust-strip wrap">
          <span>
            <ShieldCheck /> Processamento no dispositivo
          </span>
          <span>
            <Cpu /> Modelos que você escolhe
          </span>
          <span>
            <Sparkles /> Sem complicação técnica
          </span>
        </div>
        <section
          id="como-funciona"
          className="section steps-section wrap reveal"
        >
          <div className="section-heading">
            <div>
              <div className="eyebrow">01 / SIMPLES DESDE O INÍCIO</div>
              <h2>Escolha. Baixe. Converse.</h2>
            </div>
            <p className="section-intro">
              Toda a liberdade da IA local.
              <br />
              Sem precisar se tornar um especialista.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((s) => (
              <article className="step" key={s.number}>
                <div
                  className={`step-art step-art-${s.art}`}
                  aria-hidden="true"
                >
                  {s.art === "choose" ? (
                    <>
                      <span className="model-tile tile-back">
                        <Boxes />
                      </span>
                      <span className="model-tile tile-middle">
                        <Cpu />
                      </span>
                      <span className="model-tile tile-front">
                        <Sparkles />
                        <i>
                          <Check size={10} />
                        </i>
                      </span>
                    </>
                  ) : s.art === "prepare" ? (
                    <div className="download-demo">
                      <span>
                        <Download size={14} /> Preparando possibilidades{" "}
                        <Check size={13} />
                      </span>
                      <div>
                        <i />
                      </div>
                      <small>SEU MODELO, PRONTO PARA USAR</small>
                    </div>
                  ) : (
                    <div className="chat-demo">
                      <span>Vamos tirar uma ideia do papel?</span>
                      <div>
                        <Sparkles size={14} />
                        <i />
                        <i />
                      </div>
                    </div>
                  )}
                </div>
                <div className="step-label">
                  {s.number}
                  <span>{s.label}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>
        <FeatureExplorer />
        <ModelAssistant />
        <ModelControls />
        <section className="privacy-section section" id="privacidade">
          <div className="wrap privacy-layout">
            <div className="privacy-art reveal" aria-hidden="true">
              <div className="privacy-orbit p-orbit-one" />
              <div className="privacy-orbit p-orbit-two" />
              <div className="privacy-orbit p-orbit-three" />
              <div className="privacy-lock">
                <LockKeyhole strokeWidth={1.2} />
              </div>
              <span className="privacy-node node-one">
                <MessageSquare size={17} />
              </span>
              <span className="privacy-node node-two">
                <FileIcon />
              </span>
              <span className="privacy-local">
                <span className="status-dot" /> PROCESSADO AQUI
              </span>
            </div>
            <div className="privacy-copy reveal">
              <div className="eyebrow">05 / MAIS CONTROLE SOBRE SEUS DADOS</div>
              <h2>
                Algumas conversas
                <br />
                não precisam sair
                <br />
                <span>do seu computador.</span>
              </h2>
              <p className="section-intro">
                Suas ideias, seus rascunhos, suas perguntas. Com modelos
                executados localmente, as conversas podem ser processadas no
                próprio dispositivo.
              </p>
              <div className="privacy-benefit">
                <HardDrive size={17} />
                <span>Um ambiente de IA sob seu controle.</span>
              </div>
              <p className="fine-print">
                Downloads, atualizações e outros serviços podem precisar de
                internet. A privacidade também depende das configurações, dos
                modelos e dos recursos utilizados.
              </p>
            </div>
          </div>
        </section>
        <section
          className="section comparison-section wrap reveal"
          id="comparacao"
        >
          <div className="comparison-heading">
            <div className="eyebrow">
              06 / MENOS BARREIRAS. MAIS POSSIBILIDADES.
            </div>
            <h2>
              A potência da IA local.
              <br />
              <span className="muted-heading">
                A complexidade fica para trás.
              </span>
            </h2>
          </div>
          <div className="comparison-grid">
            <div className="traditional">
              <div className="comparison-title">
                <Terminal size={20} />
                <h3>O caminho tradicional</h3>
              </div>
              <ul>
                {[
                  "Terminal e linhas de comando",
                  "Configuração manual do ambiente",
                  "Escolha técnica de modelos",
                  "Ferramentas separadas para conversar",
                ].map((t) => (
                  <li key={t}>
                    <span>—</span>
                    {t}
                  </li>
                ))}
              </ul>
              <span className="comparison-footnote">
                Mais etapas entre você e a primeira ideia.
              </span>
            </div>
            <div className="comparison-arrow" aria-hidden="true">
              <ArrowRight size={18} />
            </div>
            <div className="with-allm4">
              <div className="comparison-title">
                <span className="brand-icon">
                  <Sparkles size={18} />
                </span>
                <h3>O seu caminho com Allm4</h3>
              </div>
              <ul>
                {[
                  "Uma interface visual e intuitiva",
                  "Catálogo e download simplificado",
                  "Recomendações para seu hardware",
                  "Chat pronto para usar seus modelos",
                ].map((t) => (
                  <li key={t}>
                    <Check size={15} />
                    {t}
                  </li>
                ))}
              </ul>
              <span className="comparison-footnote">
                Mais espaço para o que você quer criar.
              </span>
            </div>
          </div>
        </section>
        <Downloads />
      </main>
      <Footer />
    </MotionRoot>
  );
}
function FileIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5" />
    </svg>
  );
}
