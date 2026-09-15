"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function MotionRoot({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const cursorEl = cursor.current;
    const glowEl = glow.current;
    const stage = el?.querySelector<HTMLElement>(".product-stage");
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const finePointer = window.matchMedia("(pointer: fine)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const motionEnabled = () =>
      !reducedMotion.matches && finePointer.matches && window.innerWidth >= 900;

    const resetStage = () => {
      if (!stage) return;
      stage.style.setProperty("--stage-rx", "0deg");
      stage.style.setProperty("--stage-ry", "0deg");
      stage.style.setProperty("--stage-tx", "0px");
      stage.style.setProperty("--stage-ty", "0px");
    };

    const activate = () => {
      observer?.disconnect();
      el.querySelectorAll(".reveal").forEach((n) =>
        n.classList.remove("reveal-pending"),
      );
      if (reducedMotion.matches) return;

      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("reveal-pending");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.08, rootMargin: "0px 0px 30px 0px" },
      );

      el.querySelectorAll(".reveal").forEach((n) => {
        if (n.getBoundingClientRect().top > window.innerHeight) {
          n.classList.add("reveal-pending");
          observer?.observe(n);
        }
      });
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !motionEnabled()) {
        cursorEl?.classList.remove("is-visible");
        glowEl?.classList.remove("is-visible");
        resetStage();
        return;
      }

      cursorEl?.classList.add("is-visible");
      glowEl?.classList.add("is-visible");

      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-2px, -2px)`;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--pointer-x", `${x * 9}px`);
        el.style.setProperty("--pointer-y", `${y * 7}px`);

        if (glowEl) {
          glowEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }

        if (stage) {
          const rect = stage.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (inside) {
            const stageX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const stageY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            stage.style.setProperty("--stage-rx", `${stageY * -0.9}deg`);
            stage.style.setProperty("--stage-ry", `${stageX * 1.25}deg`);
            stage.style.setProperty("--stage-tx", `${stageX * 3}px`);
            stage.style.setProperty("--stage-ty", `${stageY * 2}px`);
          } else {
            resetStage();
          }
        }
      });
    };

    const hideCursor = () => {
      cursorEl?.classList.remove("is-visible");
      glowEl?.classList.remove("is-visible");
      resetStage();
    };

    activate();
    reducedMotion.addEventListener("change", activate);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hideCursor);
    document.documentElement.addEventListener("mouseleave", hideCursor);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", activate);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hideCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  return (
    <div ref={root} className="site-motion">
      <style>{`
        @media (pointer: fine) and (min-width: 900px) and (prefers-reduced-motion: no-preference) {
          .site-motion,
          .site-motion * {
            cursor: none !important;
          }

          .hero-copy > .eyebrow,
          .hero-copy > h1,
          .hero-copy > p,
          .hero-copy > .hero-actions,
          .hero-copy > .platform-note {
            animation: hero-rise-in 760ms cubic-bezier(.22,.8,.24,1) both;
          }

          .hero-copy > .eyebrow { animation-delay: 60ms; }
          .hero-copy > h1 { animation-delay: 145ms; }
          .hero-copy > p { animation-delay: 245ms; }
          .hero-copy > .hero-actions { animation-delay: 340ms; }
          .hero-copy > .platform-note { animation-delay: 430ms; }

          .hero h1 > span {
            display: inline-block;
            animation: keyword-mask-in 900ms cubic-bezier(.18,.86,.28,1) 420ms both;
          }

          .hero-art {
            animation: hero-art-in 1100ms cubic-bezier(.2,.8,.2,1) 140ms both;
          }

          .orbit-one {
            animation: orbit-one-drift 16s ease-in-out infinite;
          }

          .orbit-two {
            animation: orbit-two-drift 21s ease-in-out infinite reverse;
          }

          .orbit-three {
            animation: orbit-three-drift 13s ease-in-out infinite;
          }

          .core {
            animation: core-breathe 5.5s ease-in-out infinite;
          }

          .orbit-point {
            animation: orbit-point-pulse 3.8s ease-in-out infinite;
          }

          .product-stage .app-window {
            transform:
              rotateX(calc(3deg + var(--stage-rx, 0deg)))
              rotateY(var(--stage-ry, 0deg))
              translate3d(var(--stage-tx, 0px), var(--stage-ty, 0px), 0);
            transition:
              transform 170ms ease-out,
              box-shadow 260ms ease;
            will-change: transform;
          }

          .product-stage:hover .app-window {
            box-shadow:
              0 -16px 95px rgba(229, 137, 69, 0.12),
              0 42px 95px rgba(0, 0, 0, 0.52),
              0 0 0 1px rgba(246, 124, 82, 0.08);
          }

          .step,
          .assistant-console,
          .controls-console,
          .download-card,
          .traditional,
          .with-allm4,
          .feature-visual {
            transition:
              transform 260ms cubic-bezier(.2,.8,.2,1),
              border-color 260ms ease,
              box-shadow 260ms ease,
              filter 260ms ease;
            will-change: transform;
          }

          .step:hover,
          .assistant-console:hover,
          .controls-console:hover,
          .download-card:hover,
          .traditional:hover,
          .with-allm4:hover,
          .feature-visual:hover {
            transform: translateY(-4px);
            border-color: rgba(246, 124, 82, 0.28);
            box-shadow:
              0 22px 50px rgba(0, 0, 0, 0.22),
              0 0 0 1px rgba(246, 124, 82, 0.06),
              0 0 34px rgba(246, 124, 82, 0.05);
            filter: brightness(1.025);
          }

          .step,
          .download-card,
          .traditional,
          .with-allm4 {
            position: relative;
            overflow: hidden;
          }

          .step::after,
          .download-card::after,
          .traditional::after,
          .with-allm4::after {
            content: "";
            position: absolute;
            top: -45%;
            bottom: -45%;
            left: -28%;
            width: 18%;
            pointer-events: none;
            opacity: 0;
            transform: translateX(-220%) rotate(16deg);
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.09),
              rgba(246, 124, 82, 0.08),
              transparent
            );
          }

          .step:hover::after,
          .download-card:hover::after,
          .traditional:hover::after,
          .with-allm4:hover::after {
            animation: card-sheen 820ms ease-out;
          }

          .hero-actions .button,
          .download-button {
            position: relative;
            overflow: hidden;
            isolation: isolate;
          }

          .hero-actions .button::after,
          .download-button::after {
            content: "";
            position: absolute;
            inset: -40% auto -40% -45%;
            width: 28%;
            pointer-events: none;
            transform: skewX(-18deg) translateX(-240%);
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.34),
              transparent
            );
            animation: button-sheen 5.8s ease-in-out infinite;
          }

          .reveal h2 > span {
            display: inline-block;
            clip-path: inset(0 0 0 0);
            transform: translateY(0);
            opacity: 1;
            transition:
              clip-path 700ms cubic-bezier(.2,.8,.2,1) 120ms,
              transform 700ms cubic-bezier(.2,.8,.2,1) 120ms,
              opacity 450ms ease 120ms;
          }

          .reveal-pending h2 > span {
            clip-path: inset(100% 0 0 0);
            transform: translateY(14px);
            opacity: 0;
          }
        }

        .ambient-pointer-glow {
          position: fixed;
          left: 0;
          top: 0;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 3;
          opacity: 0;
          background:
            radial-gradient(circle at center,
              rgba(186, 216, 255, 0.075) 0%,
              rgba(246, 124, 82, 0.035) 28%,
              rgba(126, 178, 255, 0.018) 46%,
              transparent 70%);
          filter: blur(10px);
          mix-blend-mode: screen;
          transition: opacity 220ms ease;
          will-change: transform;
        }

        .ambient-pointer-glow.is-visible {
          opacity: 0.72;
        }

        .allm4-cursor {
          position: fixed;
          left: 0;
          top: 0;
          width: 16px;
          height: 21px;
          pointer-events: none;
          z-index: 2147483000;
          opacity: 0;
          transition: opacity 100ms ease;
          will-change: transform;
        }

        .allm4-cursor svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
          transform: rotate(-8deg);
          transform-origin: 12% 10%;
          filter:
            drop-shadow(0 0 3px rgba(232, 244, 255, 0.95))
            drop-shadow(0 0 8px rgba(191, 220, 255, 0.68))
            drop-shadow(0 0 15px rgba(126, 178, 255, 0.38));
        }

        .allm4-cursor path {
          fill: #05070a;
          stroke: rgba(238, 247, 255, 0.96);
          stroke-width: 1.05;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .allm4-cursor.is-visible {
          opacity: 1;
        }

        @keyframes hero-rise-in {
          from {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes keyword-mask-in {
          from {
            opacity: 0;
            clip-path: inset(0 100% 0 0);
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: translateY(0);
          }
        }

        @keyframes hero-art-in {
          from {
            opacity: 0;
            transform: translate3d(18px, 10px, 0) scale(0.97);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes orbit-one-drift {
          0%, 100% {
            transform: translate(-50%, -50%) rotateX(59deg) rotateZ(-27deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotateX(59deg) rotateZ(-22deg) scale(1.012);
          }
        }

        @keyframes orbit-two-drift {
          0%, 100% {
            transform: translate(-50%, -50%) rotateX(57deg) rotateZ(20deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotateX(57deg) rotateZ(14deg) scale(0.988);
          }
        }

        @keyframes orbit-three-drift {
          0%, 100% {
            transform: translate(-50%, -50%) rotateX(51deg) rotateZ(-35deg) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) rotateX(51deg) rotateZ(-29deg) scale(1.02);
          }
        }

        @keyframes core-breathe {
          0%, 100% {
            transform: translate(-50%, -50%) rotateX(35deg) rotateZ(-25deg) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: translate(-50%, -50%) rotateX(35deg) rotateZ(-23deg) scale(1.035);
            filter: brightness(1.08);
          }
        }

        @keyframes orbit-point-pulse {
          0%, 100% {
            opacity: 0.68;
            box-shadow: 0 0 18px 3px rgba(231, 136, 89, 0.38);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 26px 6px rgba(231, 136, 89, 0.56);
          }
        }

        @keyframes card-sheen {
          0% {
            opacity: 0;
            transform: translateX(-220%) rotate(16deg);
          }
          25% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translateX(820%) rotate(16deg);
          }
        }

        @keyframes button-sheen {
          0%, 72% {
            transform: skewX(-18deg) translateX(-240%);
            opacity: 0;
          }
          78% { opacity: 0.9; }
          90% {
            transform: skewX(-18deg) translateX(560%);
            opacity: 0;
          }
          100% {
            transform: skewX(-18deg) translateX(560%);
            opacity: 0;
          }
        }

        @media (max-width: 1000px) and (min-width: 900px) {
          .hero-art {
            animation: none !important;
          }
        }

        @media (pointer: coarse), (max-width: 899px), (prefers-reduced-motion: reduce) {
          .allm4-cursor,
          .ambient-pointer-glow {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-copy > *,
          .hero-art,
          .orbit,
          .core,
          .orbit-point,
          .hero h1 > span,
          .hero-actions .button::after,
          .download-button::after,
          .step::after,
          .download-card::after,
          .traditional::after,
          .with-allm4::after {
            animation: none !important;
            transition: none !important;
          }

          .product-stage .app-window {
            transform: rotateX(3deg) !important;
            transition: none !important;
          }
        }
      `}</style>
      <div ref={glow} className="ambient-pointer-glow" aria-hidden="true" />
      <div ref={cursor} className="allm4-cursor" aria-hidden="true">
        <svg viewBox="0 0 18 24" focusable="false">
          <path d="M2.15 1.75 Q1.72 1.42 1.74 2.08 L2.12 18.45 Q2.14 19.08 2.63 19.4 Q3.03 19.66 3.42 19.27 L6.63 15.98 L9.67 22.05 Q9.93 22.56 10.45 22.31 L12.58 21.28 Q13.08 21.04 12.83 20.53 L9.88 14.48 L15.42 14.17 Q16.02 14.14 16.28 13.62 Q16.47 13.21 16.08 12.9 Z" />
        </svg>
      </div>
      {children}
    </div>
  );
}
