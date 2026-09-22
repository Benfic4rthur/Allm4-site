"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

type DemoImageModalProps = {
  src: string;
  alt: string;
  triggerClassName: string;
  children: ReactNode;
  gallery?: Array<{ src: string; alt: string }>;
  initialIndex?: number;
};

export function DemoImageModal({
  src,
  alt,
  triggerClassName,
  children,
  gallery,
  initialIndex = 0,
}: DemoImageModalProps) {
  const items = gallery?.length ? gallery : [{ src, alt }];
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeItem = items[activeIndex] ?? items[0];
  const hasGallery = items.length > 1;

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  }

  return (
    <DialogPrimitive.Root
      onOpenChange={(open) => {
        if (open) setActiveIndex(initialIndex);
      }}
    >
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className={`${triggerClassName} demo-image-trigger`}
          aria-label={`Ampliar imagem: ${alt}`}
        >
          {children}
          <span className="demo-image-zoom-hint" aria-hidden="true">
            <Maximize2 size={14} /> Ampliar
          </span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="demo-image-overlay" />
        <DialogPrimitive.Content
          className="demo-image-dialog"
          onKeyDown={(event) => {
            if (!hasGallery) return;
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1);
            }
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            {activeItem.alt}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Visualização ampliada da imagem demonstrativa do Allm4.
          </DialogPrimitive.Description>

          <div className="demo-image-dialog-chrome">
            <span className="demo-image-dialog-status">
              <span className="status-dot" /> DEMONSTRAÇÃO DO ALLM4
            </span>
            <DialogPrimitive.Close
              className="demo-image-dialog-close"
              aria-label="Fechar imagem ampliada"
            >
              <X size={19} />
            </DialogPrimitive.Close>
          </div>

          <div className="demo-image-dialog-body">
            {hasGallery && (
              <button
                type="button"
                className="demo-image-dialog-nav demo-image-dialog-nav-previous"
                onClick={() => move(-1)}
                aria-label="Ver imagem anterior do assistente"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <img src={activeItem.src} alt={activeItem.alt} />
            {hasGallery && (
              <button
                type="button"
                className="demo-image-dialog-nav demo-image-dialog-nav-next"
                onClick={() => move(1)}
                aria-label="Ver próxima imagem do assistente"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          <div className="demo-image-dialog-footer">
            <span>{activeItem.alt}</span>
            <span>
              {hasGallery && `${activeIndex + 1} / ${items.length} · `}
              ESC PARA FECHAR
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
