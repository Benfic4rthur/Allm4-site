"use client";

import type { ReactNode } from "react";
import { Maximize2, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

type DemoImageModalProps = {
  src: string;
  alt: string;
  triggerClassName: string;
  children: ReactNode;
};

export function DemoImageModal({
  src,
  alt,
  triggerClassName,
  children,
}: DemoImageModalProps) {
  return (
    <DialogPrimitive.Root>
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
        <DialogPrimitive.Content className="demo-image-dialog">
          <DialogPrimitive.Title className="sr-only">
            {alt}
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
            <img src={src} alt={alt} />
          </div>

          <div className="demo-image-dialog-footer">
            <span>{alt}</span>
            <span>ESC PARA FECHAR</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
