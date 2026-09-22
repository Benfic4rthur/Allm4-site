import { Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { DemoImageModal } from "./demo-image-modal";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
export function AppScreenshot({
  full = false,
  src = "/images/allm4-chat-v0132-sem-dock.avif",
  alt = "Interface real do Allm4 no ambiente de Chat",
  gallery,
  initialIndex,
}: {
  full?: boolean;
  src?: string;
  alt?: string;
  gallery?: Array<{ src: string; alt: string }>;
  initialIndex?: number;
}) {
  const imageSrc = `${publicBasePath}${src}`;
  const modalGallery = gallery?.map((item) => ({
    ...item,
    src: `${publicBasePath}${item.src}`,
  }));

  return (
    <DemoImageModal
      src={imageSrc}
      alt={alt}
      triggerClassName={`app-window ${full ? "full-screenshot" : ""}`}
      gallery={modalGallery}
      initialIndex={initialIndex}
    >
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
          src={imageSrc}
          alt={alt}
          width="3456"
          height="2078"
          loading={full ? "lazy" : "eager"}
          fetchPriority={full ? "auto" : "high"}
        />
      </div>
    </DemoImageModal>
  );
}
