"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { products } from "@/lib/products";
import "./brand-orbit.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
type Phase = "idle" | "gathering" | "dropping" | "revealing";

export function BrandOrbit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runningRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  function resetTilt() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    rootRef.current?.style.setProperty("--orbit-tilt-x", "0deg");
    rootRef.current?.style.setProperty("--orbit-tilt-y", "0deg");
  }

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (runningRef.current || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      rootRef.current?.style.setProperty("--orbit-tilt-x", `${-y * 9}deg`);
      rootRef.current?.style.setProperty("--orbit-tilt-y", `${x * 12}deg`);
    });
  }

  function revealProducts(smooth: boolean) {
    const catalog = document.getElementById("produtos");
    if (!catalog) return;
    catalog.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
    document.getElementById("products-title")?.focus({ preventScroll: true });
    if (smooth) {
      catalog.animate(
        [{ opacity: 0.5, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 800, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
    }
  }

  function exploreProducts() {
    if (runningRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealProducts(false);
      return;
    }
    runningRef.current = true;
    resetTilt();
    setPhase("gathering");
    timersRef.current = [
      setTimeout(() => setPhase("dropping"), 950),
      setTimeout(() => {
        setPhase("revealing");
        revealProducts(true);
      }, 1500),
      setTimeout(() => {
        setPhase("idle");
        runningRef.current = false;
        timersRef.current = [];
      }, 2600),
    ];
  }

  return (
    <div className="brand-orbit" data-phase={phase} ref={rootRef}>
      <div className="brand-orbit-stage" onPointerMove={followPointer} onPointerLeave={resetTilt}>
        <div className="brand-orbit-visual">
          <div className="brand-orbit-halo" aria-hidden="true" />
          <div className="brand-orbit-ring brand-orbit-ring-outer" aria-hidden="true" />
          <div className="brand-orbit-ring brand-orbit-ring-inner" aria-hidden="true" />
          <div className="brand-orbit-tilt">
            <ul className="brand-orbit-apps" aria-label="Aplicativos da ALLM4">
              {products.map((product, index) => (
                <li className="brand-orbit-track" style={{ "--orbit-start": `${index * 90 - 42}deg` } as CSSProperties} key={product.slug}>
                  <div className="brand-orbit-position">
                    <div className="brand-orbit-upright">
                      <a
                        className={`brand-orbit-app brand-orbit-app--${product.slug}`}
                        href={product.url.startsWith("/") ? `${publicBasePath}${product.url}` : product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${product.name} (abre em nova aba)`}
                        tabIndex={phase === "idle" ? 0 : -1}
                      >
                        <Image src={`${publicBasePath}${product.icon}`} alt="" width={72} height={72} unoptimized />
                        <span className="brand-orbit-tooltip">{product.name}</span>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="brand-orbit-core" aria-hidden="true">
            <BrandMark className="brand-orbit-mark" decorative />
          </div>
        </div>
        <div className="brand-orbit-signature" aria-hidden="true"><strong>ALLM4</strong><span>SOFTWARE FOR A BRIGHTER DAY</span></div>
      </div>
      <button className="brand-orbit-explore" type="button" onClick={exploreProducts} disabled={phase !== "idle"} aria-controls="produtos">
        <span>Encontre seu próximo app</span><ArrowDown size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
