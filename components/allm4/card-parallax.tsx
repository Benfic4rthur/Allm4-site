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
        const rotateX = y * -6.5;
        const rotateY = x * 8.5;
        const translateX = x * 7;
        const translateY = y * 5 - 6;

        card.style.transform =
          `perspective(850px) translate3d(${translateX}px, ${translateY}px, 18px) ` +
          `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`;
        card.style.transition =
          "transform 90ms cubic-bezier(.2,.8,.2,1), border-color 260ms ease, box-shadow 260ms ease, filter 260ms ease";
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
