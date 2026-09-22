import {
  Apple,
  ArrowDown,
  ArrowUpRight,
  Cpu,
  Mic,
  Monitor,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Downloads } from "@/components/allm4/downloads";
import { FeatureExplorer } from "@/components/allm4/feature-explorer";
import { Footer } from "@/components/allm4/footer";
import { ModelAssistant } from "@/components/allm4/model-controls";
import { MotionRoot } from "@/components/allm4/motion";
import { PersonalizationShowcase } from "@/components/allm4/personalization-showcase";
import { ProjectShowcase } from "@/components/allm4/project-showcase";
import { TrustRepair } from "@/components/allm4/trust-repair";
import { AppScreenshot, Brand, CTA } from "@/components/allm4/ui";

export default function Home() {
  return (
    <MotionRoot>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="header wrap" id="inicio">
        <Brand label />
        <nav aria-label="Navegação principal">
          <a href="#recursos">Ambientes</a>
          <a href="#personalizacao">Personalização</a>
          <a href="#projetos">Projetos</a>
          <a href="#privacidade">Confiança</a>
        </nav>
        <CTA small />
      </header>

      <main id="conteudo">
        <section className="hero evolved-hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> A IA FICOU SIMPLES
            </div>
            <h1 id="hero-title">
              Você não precisa
              <br />
              entender de IA.
              <br />
              <span>O Allm4 simplifica tudo.</span>
            </h1>
            <p>
              Você não precisa ficar de fora do mundo da IA por não saber termos
              técnicos. Converse, crie imagens e tire projetos do papel no seu
              computador, com passos claros desde o primeiro clique. Depois de
              instalar os modelos, muitas tarefas funcionam sem internet.
            </p>
            <div className="hero-actions">
              <CTA />
              <a className="text-button" href="#recursos">
                Veja como é simples <ArrowDown size={16} />
              </a>
            </div>
            <div className="platform-note">
              <Apple size={15} /><span>macOS Apple Silicon</span>
              <span className="dot-divider" />
              <Monitor size={15} /><span>Windows</span>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="core"><Sparkles /></div>
            <span className="orbit-label">PROCESSAMENTO LOCAL</span>
            <span className="orbit-point" />
          </div>

          <div className="product-stage" id="produto">
            <div className="stage-top">
              <span><span className="status-dot" /> CHAT · IMAGEM · PROJETOS</span>
              <span>ALLM4 DESKTOP <ArrowUpRight size={12} /></span>
            </div>
            <AppScreenshot />
            <div className="floating-chip">
              <div className="chip-icon"><Sparkles size={20} /></div>
              <div><strong>Você escolhe o que quer fazer.</strong><span>O Allm4 cuida da parte difícil.</span></div>
              <span className="status-dot" />
            </div>
          </div>
        </section>

        <div className="trust-strip wrap">
          <span><Sparkles /> Feito para quem está começando</span>
          <span><Cpu /> Modelos guiados para seu computador</span>
          <span><ShieldCheck /> Passos claros e você no controle</span>
          <span><Mic /> Entrada por voz nos três ambientes</span>
        </div>

        <FeatureExplorer />
        <PersonalizationShowcase />
        <ProjectShowcase />
        <ModelAssistant />
        <TrustRepair />
        <Downloads />
      </main>
      <Footer />
    </MotionRoot>
  );
}
