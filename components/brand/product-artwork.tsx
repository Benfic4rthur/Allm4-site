import Image from "next/image";
import { Check, FileText, Sun } from "lucide-react";
import type { Product } from "@/lib/products";
import "./product-artwork.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const artworkDescriptions: Record<string, string> = {
  notchficator: "Demonstração do Notchficator com um vídeo no notch de um MacBook.",
  lum4: "Ilustração do LUM4, com seu ícone luminoso e uma barra de brilho.",
  jacopiei: "Ilustração do JáCopiei? com documentos e uma confirmação de cópia.",
  "allm4-local-ia": "Interface real do ALLM4 Local IA, com chat, imagem e projetos.",
};

export function ProductArtwork({ product }: { product: Product }) {
  return (
    <div
      className={`studio-art studio-art--${product.slug}`}
      role="img"
      aria-label={artworkDescriptions[product.slug] ?? product.name}
    >
      <div className="studio-art-scene" aria-hidden="true">
        {product.slug === "notchficator" ? (
          <div className="studio-art-notebook">
            <Image
              className="studio-art-notebook-image"
              src={`${publicBasePath}/products/notchficator-preview.png`}
              alt=""
              width={1200}
              height={630}
              unoptimized
            />
          </div>
        ) : product.slug === "lum4" ? (
          <div className="studio-art-light">
            <div className="studio-art-light-orbit" />
            <Image
              className="studio-art-light-icon"
              src={`${publicBasePath}${product.icon}`}
              alt=""
              width={112}
              height={112}
              unoptimized
            />
            <div className="studio-art-brightness">
              <Sun size={13} strokeWidth={1.6} />
              <div className="studio-art-brightness-track">
                <span />
              </div>
              <Sun size={18} strokeWidth={1.6} />
            </div>
          </div>
        ) : product.slug === "jacopiei" ? (
          <div className="studio-art-files">
            <div className="studio-art-file studio-art-file-back" />
            <div className="studio-art-file studio-art-file-front">
              <div className="studio-art-file-toolbar"><i /><i /><i /></div>
              {[0, 1, 2].map((file) => (
                <div className="studio-art-file-row" key={file}>
                  <FileText size={15} strokeWidth={1.4} />
                  <span />
                  <Check size={11} strokeWidth={2} />
                </div>
              ))}
            </div>
            <Image
              className="studio-art-folder-icon"
              src={`${publicBasePath}${product.icon}`}
              alt=""
              width={120}
              height={120}
              unoptimized
            />
            <span className="studio-art-file-check"><Check size={18} strokeWidth={2.2} /></span>
          </div>
        ) : (
          <div className="studio-art-app-window">
            <Image
              src={`${publicBasePath}${product.screenshot ?? product.icon}`}
              alt=""
              width={product.screenshotWidth ?? 3456}
              height={product.screenshotHeight ?? 2024}
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}
