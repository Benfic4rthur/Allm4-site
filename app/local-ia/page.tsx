import type { Metadata } from "next";
import { Apple, ArrowDown, ArrowUpRight, Check, Monitor } from "lucide-react";
import { Downloads } from "@/components/allm4/downloads";
import { CouponBubble } from "@/components/allm4/coupon-bubble";
import { FeatureExplorer } from "@/components/allm4/feature-explorer";
import { Footer } from "@/components/allm4/footer";
import { ModelAssistant } from "@/components/allm4/model-controls";
import { MotionRoot } from "@/components/allm4/motion";
import { PersonalizationShowcase } from "@/components/allm4/personalization-showcase";
import { ProjectShowcase } from "@/components/allm4/project-showcase";
import { CardParallax } from "@/components/allm4/card-parallax";
import { ImageShowcase, QuickChoices, SiteQuestions } from "@/components/allm4/site-story";
import { TrustRepair } from "@/components/allm4/trust-repair";
import { AppScreenshot, Brand, CTA } from "@/components/allm4/ui";
import "../site-refresh.css";

const title = "ALLM4 Local IA — IA local simples para qualquer pessoa";
const description =
  "Converse, crie imagens e trabalhe em projetos com IA local, mesmo sem conhecimento técnico. ALLM4 Local IA para macOS Apple Silicon e Windows.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/local-ia",
    siteName: "ALLM4",
    title,
    description,
    images: [
      {
        url: "/images/allm4-social-preview-v2.png",
        width: 1200,
        height: 630,
        alt: "ALLM4 Local IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/allm4-social-preview-v2.png"],
  },
};

export default function LocalIAPage() {
  return (
    <>
      <CardParallax />
      <MotionRoot>
        <div className="simple-site">
          <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
          <header className="header wrap" id="inicio">
            <Brand label />
            <nav aria-label="Navegação principal">
              <a href="#assistente">Como começar</a>
              <a href="#recursos">O que dá para fazer</a>
              <a href="#preco">Preço e acesso</a>
              <a href="#duvidas">Dúvidas</a>
            </nav>
            <CTA small />
          </header>

          <main id="conteudo">
            <section className="hero welcome-hero wrap" aria-labelledby="hero-title">
              <div className="hero-copy">
                <div className="eyebrow"><span className="status-dot" /> IA NO SEU COMPUTADOR. SEM COMPLICAR.</div>
                <h1 id="hero-title">Você não precisa<br />entender de IA.<br /><span>Só do que quer fazer.</span></h1>
                <p>Converse, crie imagens e construa projetos. O Allm4 ajuda a escolher a IA para o seu computador e te guia do primeiro download à primeira ideia.</p>
                <div className="hero-actions">
                  <a className="button" href="#download">Baixar e experimentar <ArrowUpRight size={18} aria-hidden="true" /></a>
                  <a className="text-button" href="#assistente">Como funciona <ArrowDown size={16} aria-hidden="true" /></a>
                </div>
                <p className="welcome-offer">Uso inicial gratuito. Depois, pagamento único, sem mensalidade.</p>
                <div className="platform-note">
                  <Apple size={16} aria-hidden="true" /><span>Mac com chip Apple</span>
                  <span className="dot-divider" /><Monitor size={16} aria-hidden="true" /><span>Windows</span>
                </div>
              </div>
              <div className="welcome-visual">
                <div className="welcome-visual-heading"><span className="status-dot" /> UM APLICATIVO. TRÊS POSSIBILIDADES.</div>
                <div className="product-stage" id="produto">
                  <AppScreenshot src="/images/allm4-chat-hero-v0138.png" width={3456} height={2024} maskWindowCorners alt="Tela real do Allm4, com acesso a Chat, Imagem e Projetos" />
                </div>
                <div className="welcome-caption"><span><Check size={16} aria-hidden="true" /> Esta é a interface real do Allm4.</span><a href="#recursos">Conheça por dentro <ArrowDown size={14} aria-hidden="true" /></a></div>
              </div>
            </section>

            <QuickChoices />
            <ModelAssistant />
            <FeatureExplorer />
            <ImageShowcase />
            <ProjectShowcase />
            <PersonalizationShowcase />
            <TrustRepair />
            <Downloads />
            <SiteQuestions />
          </main>
          <Footer />
        </div>
      </MotionRoot>
      <CouponBubble />
    </>
  );
}
