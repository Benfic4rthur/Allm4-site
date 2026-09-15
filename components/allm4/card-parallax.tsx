"use client";

import { useEffect } from "react";

const cardSelector = [
  ".step",
  ".assistant-console",
  ".controls-console",
  ".download-card",
  ".traditional",
  ".with-allm4",
  ".feature-visual",
  ".explorer-screenshot",
].join(", ");

export function CardParallax() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let activeCard: HTMLElement | null = null;
    let frame = 0;

    const enabled = () =>
      !reducedMotion.matches && finePointer.matches && window.innerWidth >= 900;

    const resetCard = (card: HTMLElement | null) => {
      if (!card) return;
      card.style.removeProperty("transform");
      card.style.removeProperty("transition");
      card.style.removeProperty("transform-style");
      card.style.removeProperty("will-change");
      card.style.removeProperty("z-index");
      card.style.removeProperty("--parallax-light-x");
      card.style.removeProperty("--parallax-light-y");
    };

    const clear = () => {
      cancelAnimationFrame(frame);
      resetCard(activeCard);
      activeCard = null;
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !enabled()) {
        clear();
        return;
      }

      const source = event.target;
      const card =
        source instanceof Element
          ? source.closest<HTMLElement>(cardSelector)
          : null;

      if (card !== activeCard) {
        resetCard(activeCard);
        activeCard = card;
      }

      if (!card) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (activeCard !== card) return;

        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        const isExplorer = card.classList.contains("explorer-screenshot");

        const rotateX = y * (isExplorer ? -7.5 : -6.5);
        const rotateY = x * (isExplorer ? 10.5 : 8.5);
        const translateX = x * (isExplorer ? 12 : 7);
        const translateY = y * (isExplorer ? 8 : 5) - (isExplorer ? 5 : 6);
        const translateZ = isExplorer ? 42 : 18;
        const scale = isExplorer ? 1.025 : 1.018;
        const perspective = isExplorer ? 900 : 850;
        const rotateZ = isExplorer ? ` rotateZ(${x * 0.9 - 2}deg)` : "";

        card.style.setProperty("--parallax-light-x", `${(x + 1) * 50}%`);
        card.style.setProperty("--parallax-light-y", `${(y + 1) * 50}%`);
        card.style.transform =
          `perspective(${perspective}px) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) ` +
          `rotateX(${rotateX}deg) rotateY(${rotateY}deg)${rotateZ} scale3d(${scale}, ${scale}, ${scale})`;
        card.style.transition =
          "transform 80ms cubic-bezier(.2,.8,.2,1), border-color 260ms ease, box-shadow 260ms ease, filter 260ms ease";
        card.style.transformStyle = "preserve-3d";
        card.style.willChange = "transform";
        card.style.zIndex = "2";
      });
    };

    const handlePreferenceChange = () => {
      if (!enabled()) clear();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", clear);
    window.addEventListener("resize", handlePreferenceChange, { passive: true });
    document.documentElement.addEventListener("mouseleave", clear);
    reducedMotion.addEventListener("change", handlePreferenceChange);
    finePointer.addEventListener("change", handlePreferenceChange);

    return () => {
      clear();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", clear);
      window.removeEventListener("resize", handlePreferenceChange);
      document.documentElement.removeEventListener("mouseleave", clear);
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      finePointer.removeEventListener("change", handlePreferenceChange);
    };
  }, []);

  return null;
}
