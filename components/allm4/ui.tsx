import { Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
export function Brand({ label = false }: { label?: boolean }) {
  return (
    <a href="#inicio" className="brand" aria-label="Allm4 — início">
      <span className="brand-icon">
        <Sparkles size={22} aria-hidden="true" />
      </span>
      Allm4{label && <span className="brand-label">LOCAL INTELLIGENCE</span>}
    </a>
  );
}
export function CTA({ small = false }: { small?: boolean }) {
  return (
    <a
      href={siteConfig.cta.href}
      className={`button ${small ? "button-small" : ""}`}
    >
      {siteConfig.cta.label}
      <ArrowUpRight size={small ? 15 : 18} aria-hidden="true" />
    </a>
  );
}
export function AppScreenshot({ full = false }: { full?: boolean }) {
  return (
    <div className={`app-window ${full ? "full-screenshot" : ""}`}>
      <div className="window-chrome" aria-hidden="true">
        <div className="traffic-lights">
          <i />
          <i />
          <i />
        </div>
        <span>
          <ShieldCheck size={12} /> Seu ambiente. Suas regras.
        </span>
        <span>Allm4</span>
      </div>
      <div className="screenshot-viewport">
        <img
          src="/images/allm4-app.png"
          alt="Interface real do Allm4: chat com modelo local, histórico à esquerda, seletor de modelos e painel de observabilidade"
          width="3456"
          height="2234"
          loading={full ? "lazy" : "eager"}
          fetchPriority={full ? "auto" : "high"}
        />
      </div>
    </div>
  );
}
