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
  ".product-stage .app-window",
].join(", ");

export function CardParallax() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let activeCard: HTMLElement | null = null;
    let pointerFrame = 0;
    let scrollFrame = 0;

    const enabled = () =>
      !reducedMotion.matches && finePointer.matches && window.innerWidth >= 900;

    const getHeroApp = () =>
      document.querySelector<HTMLElement>(".product-stage .app-window");

    const resetCard = (card: HTMLElement | null) => {
      if (!card) return;
      card.style.removeProperty("transform");
      card.style.removeProperty("transition");
      card.style.removeProperty("transform-style");
      card.style.removeProperty("will-change");
      card.style.removeProperty("z-index");
      card.style.removeProperty("filter");
      card.style.removeProperty("box-shadow");
      card.style.removeProperty("--parallax-light-x");
      card.style.removeProperty("--parallax-light-y");
    };

    const getScrollTilt = (card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      const cardCenter = rect.top + rect.height * 0.5;
      const distance = viewportCenter - cardCenter;
      const normalized = Math.max(
        -1,
        Math.min(1, distance / Math.max(window.innerHeight * 0.72, 1)),
      );

      return normalized * 10;
    };

    const applyHeroScroll = () => {
      const heroApp = getHeroApp();
      if (!heroApp || heroApp === activeCard) return;

      if (!enabled()) {
        resetCard(heroApp);
        return;
      }

      const scrollTilt = getScrollTilt(heroApp);
      const lift = Math.abs(scrollTilt) * 0.65;
      const scale = 1.006 + Math.abs(scrollTilt) * 0.0006;

      heroApp.style.transform =
        `perspective(900px) translate3d(0, ${-lift}px, 18px) ` +
        `rotateX(${scrollTilt}deg) scale3d(${scale}, ${scale}, ${scale})`;
      heroApp.style.transition =
        "transform 150ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, filter 220ms ease";
      heroApp.style.transformStyle = "preserve-3d";
      heroApp.style.willChange = "transform";
      heroApp.style.filter = `brightness(${1.018 + Math.abs(scrollTilt) * 0.0015})`;
      heroApp.style.boxShadow =
        "0 -14px 70px rgba(229,137,69,.09), 0 34px 82px rgba(0,0,0,.46)";
    };

    const scheduleHeroScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(applyHeroScroll);
    };

    const clear = () => {
      cancelAnimationFrame(pointerFrame);
      resetCard(activeCard);
      activeCard = null;
      scheduleHeroScroll();
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
        const previousCard = activeCard;
        resetCard(previousCard);
        activeCard = card;

        if (
          previousCard?.classList.contains("app-window") &&
          previousCard.closest(".product-stage")
        ) {
          scheduleHeroScroll();
        }
      }

      if (!card) {
        scheduleHeroScroll();
        return;
      }

      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        if (activeCard !== card) return;

        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        const isExplorer = card.classList.contains("explorer-screenshot");
        const isHeroApp =
          card.classList.contains("app-window") && !!card.closest(".product-stage");
        const scrollTilt = isHeroApp ? getScrollTilt(card) : 0;

        const rotateX =
          scrollTilt + y * (isHeroApp ? -8.5 : isExplorer ? -4.2 : -3.8);
        const rotateY = x * (isHeroApp ? 12 : isExplorer ? 5.8 : 5.2);
        const translateX = x * (isHeroApp ? 16 : isExplorer ? 7 : 4);
        const translateY =
          y * (isHeroApp ? 10 : isExplorer ? 4.5 : 3) -
          (isHeroApp ? 4 : isExplorer ? 3 : 3.5);
        const translateZ = isHeroApp ? 52 : isExplorer ? 24 : 11;
        const scale = isHeroApp ? 1.028 : isExplorer ? 1.014 : 1.011;
        const perspective = isHeroApp ? 780 : isExplorer ? 1050 : 980;
        const rotateZ = isHeroApp
          ? ` rotateZ(${x * 0.7}deg)`
          : isExplorer
            ? ` rotateZ(${x * 0.35 - 0.8}deg)`
            : "";

        card.style.setProperty("--parallax-light-x", `${(x + 1) * 50}%`);
        card.style.setProperty("--parallax-light-y", `${(y + 1) * 50}%`);
        card.style.transform =
          `perspective(${perspective}px) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) ` +
          `rotateX(${rotateX}deg) rotateY(${rotateY}deg)${rotateZ} scale3d(${scale}, ${scale}, ${scale})`;
        card.style.transition =
          "transform 90ms cubic-bezier(.2,.8,.2,1), border-color 220ms ease, box-shadow 220ms ease, filter 220ms ease";
        card.style.transformStyle = "preserve-3d";
        card.style.willChange = "transform";
        card.style.zIndex = "2";

        if (isHeroApp) {
          card.style.filter = "brightness(1.055) saturate(1.04)";
          card.style.boxShadow =
            "0 -18px 90px rgba(229,137,69,.14), 0 42px 95px rgba(0,0,0,.55)";
        }
      });
    };

    const handlePreferenceChange = () => {
      if (!enabled()) {
        cancelAnimationFrame(pointerFrame);
        cancelAnimationFrame(scrollFrame);
        resetCard(activeCard);
        resetCard(getHeroApp());
        activeCard = null;
        return;
      }

      scheduleHeroScroll();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scheduleHeroScroll, { passive: true });
    window.addEventListener("blur", clear);
    window.addEventListener("resize", handlePreferenceChange, { passive: true });
    document.documentElement.addEventListener("mouseleave", clear);
    reducedMotion.addEventListener("change", handlePreferenceChange);
    finePointer.addEventListener("change", handlePreferenceChange);

    scheduleHeroScroll();

    return () => {
      cancelAnimationFrame(pointerFrame);
      cancelAnimationFrame(scrollFrame);
      resetCard(activeCard);
      resetCard(getHeroApp());
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scheduleHeroScroll);
      window.removeEventListener("blur", clear);
      window.removeEventListener("resize", handlePreferenceChange);
      document.documentElement.removeEventListener("mouseleave", clear);
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      finePointer.removeEventListener("change", handlePreferenceChange);
    };
  }, []);

  return null;
}
