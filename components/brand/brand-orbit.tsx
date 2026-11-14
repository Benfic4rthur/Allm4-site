"use client";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { products } from "@/lib/products";
import { extensions } from "@/lib/extensions";
import "./brand-orbit.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const orbitProducts = [...products, ...extensions];
type OrbitProfile = { angle: number; radius: number; size: number; lean: number };
const orbitProfiles: Record<string, OrbitProfile> = {
  notchficator: { angle: -3, radius: 45, size: 1.04, lean: -6 },
  lum4: { angle: 3, radius: 41, size: .94, lean: 5 },
  jacopiei: { angle: -2, radius: 48, size: 1.02, lean: -4 },
  beira: { angle: 4, radius: 43, size: .9, lean: 7 },
  "codex-reset": { angle: -3, radius: 47, size: 1.06, lean: -5 },
  gelamac: { angle: 2, radius: 41, size: .95, lean: 4 },
  trio: { angle: -2, radius: 48, size: 1.03, lean: -7 },
  canalnongrato: { angle: 3, radius: 43, size: .92, lean: 6 },
  tubeorder: { angle: -3, radius: 46, size: 1, lean: -4 },
  alwaysdarkmode: { angle: 2, radius: 41, size: .94, lean: 5 },
};

function orbitStyle(slug: string, index: number): CSSProperties {
  // Stable on the server and client; new products also get a repeatable profile.
  const seed = [...slug].reduce((value, letter) => (Math.imul(value, 31) + letter.charCodeAt(0)) >>> 0, 7);
  const profile = orbitProfiles[slug] ?? { angle: seed % 7 - 3, radius: 42 + seed % 6, size: .94 + seed % 9 / 100, lean: seed % 11 - 5 };
  return {
    "--orbit-start": `${index * (360 / orbitProducts.length) - 42 + profile.angle}deg`,
    "--orbit-radius": `${profile.radius}%`,
    "--orbit-size": profile.size,
    "--orbit-lean": `${profile.lean}deg`,
  } as CSSProperties;
}

function randomizeOrbit(root: HTMLDivElement) {
  const tracks = [...root.querySelectorAll<HTMLElement>(".brand-orbit-track")];
  const slots = tracks.map((_, index) => index);
  for (let index = slots.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [slots[index], slots[other]] = [slots[other], slots[index]];
  }
  tracks.forEach((track, index) => {
    const slot = slots[index];
    const profile = orbitProfiles[orbitProducts[slot].slug];
    const initial = orbitStyle(orbitProducts[slot].slug, slot);
    // Keep the designed spacing of each slot while changing which app occupies it.
    for (const [key, value] of Object.entries(initial)) track.style.setProperty(key, String(value));
    track.style.setProperty("--orbit-start", `${slot * (360 / tracks.length) - 42 + (Math.random() - .5) * 4}deg`);
    track.style.setProperty("--orbit-radius", `${(profile?.radius ?? 44) + (Math.random() - .5)}%`);
  });
}
type Phase = "idle" | "gathering" | "dropping" | "revealing";

export function BrandOrbit() {
  useSiteLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runningRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (rootRef.current) randomizeOrbit(rootRef.current);
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function resetTilt() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    rootRef.current?.style.setProperty("--orbit-tilt-x", "0deg");
    rootRef.current?.style.setProperty("--orbit-tilt-y", "0deg");
  }

  function varyHover(event: PointerEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) {
    const angle = [-8, 0, 8][Math.floor(Math.random() * 3)];
    const link = event.currentTarget;
    link.style.setProperty("--orbit-hover-lean", `${angle}deg`);
    const button = rootRef.current?.querySelector(".brand-orbit-explore");
    link.dataset.tooltipSide = button && link.getBoundingClientRect().bottom + 54 > button.getBoundingClientRect().top ? "above" : "below";
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

  return localizeTree((
    <div className="brand-orbit" data-phase={phase} ref={rootRef}>
      <div className="brand-orbit-stage" onPointerMove={followPointer} onPointerLeave={resetTilt}>
        <div className="brand-orbit-visual">
          <div className="brand-orbit-halo" aria-hidden="true" />
          <div className="brand-orbit-ring brand-orbit-ring-outer" aria-hidden="true" />
          <div className="brand-orbit-ring brand-orbit-ring-inner" aria-hidden="true" />
          <div className="brand-orbit-tilt">
            <ul className="brand-orbit-apps" aria-label="Aplicativos e extensões da ALLM4">
              {orbitProducts.map((product, index) => (
                <li className="brand-orbit-track" style={orbitStyle(product.slug, index)} key={product.slug}>
                  <div className="brand-orbit-position">
                    <div className="brand-orbit-upright">
                      <a
                        className={`brand-orbit-app brand-orbit-app--${product.slug}`}
                        href={product.url.startsWith("/") ? `${publicBasePath}${product.url}` : product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${product.name} (abre em nova aba)`}
                        tabIndex={phase === "idle" ? 0 : -1}
                        onPointerEnter={varyHover}
                        onFocus={varyHover}
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
        <span>Encontre sua próxima ferramenta</span><ArrowDown size={17} aria-hidden="true" />
      </button>
    </div>
  ));
}
