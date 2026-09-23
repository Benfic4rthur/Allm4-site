import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { DemoImageModal } from "./demo-image-modal";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Brand({ label = false }: { label?: boolean }) {
  return (
    <a href="#inicio" className="brand" aria-label="Allm4 — início">
      <span className="brand-icon">
        <Image src={`${publicBasePath}/allm4-icon-v7.png`} width={34} height={34} alt="" aria-hidden="true" unoptimized />
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
  width = 3456,
  height = 2078,
  gallery,
  initialIndex,
  expandable = true,
  maskWindowCorners = false,
  onModalOpenChange,
}: {
  full?: boolean;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  gallery?: Array<{ src: string; alt: string }>;
  initialIndex?: number;
  expandable?: boolean;
  maskWindowCorners?: boolean;
  onModalOpenChange?: (open: boolean) => void;
}) {
  const imageSrc = `${publicBasePath}${src}`;
  const modalGallery = gallery?.map((item) => ({
    ...item,
    src: `${publicBasePath}${item.src}`,
  }));
  const frame = (
    <>
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
          className={maskWindowCorners ? "demo-screenshot-rounded" : undefined}
          width={width}
          height={height}
          loading={full ? "lazy" : "eager"}
          fetchPriority={full ? "auto" : "high"}
        />
      </div>
    </>
  );

  if (!expandable) {
    return (
      <div className={`app-window ${full ? "full-screenshot" : ""}`}>
        {frame}
      </div>
    );
  }

  return (
    <DemoImageModal
      src={imageSrc}
      alt={alt}
      triggerClassName={`app-window ${full ? "full-screenshot" : ""}`}
      gallery={modalGallery}
      initialIndex={initialIndex}
      imageClassName={maskWindowCorners ? "demo-screenshot-rounded" : undefined}
      onOpenChange={onModalOpenChange}
    >
      {frame}
    </DemoImageModal>
  );
}
