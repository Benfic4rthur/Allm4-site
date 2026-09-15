"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function MotionRoot({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const cursorEl = cursor.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const finePointer = window.matchMedia("(pointer: fine)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const customCursorEnabled = () =>
      !reducedMotion.matches && finePointer.matches && window.innerWidth >= 900;

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
      if (e.pointerType !== "mouse" || !customCursorEnabled()) {
        cursorEl?.classList.remove("is-visible");
        return;
      }

      cursorEl?.classList.add("is-visible");
      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-2px, -2px)`;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--pointer-x", `${x * 9}px`);
        el.style.setProperty("--pointer-y", `${y * 7}px`);
      });
    };

    const hideCursor = () => cursorEl?.classList.remove("is-visible");

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

        @media (pointer: coarse), (max-width: 899px), (prefers-reduced-motion: reduce) {
          .allm4-cursor {
            display: none;
          }
        }
      `}</style>
      <div ref={cursor} className="allm4-cursor" aria-hidden="true">
        <svg viewBox="0 0 18 24" focusable="false">
          <path d="M2.15 1.75 Q1.72 1.42 1.74 2.08 L2.12 18.45 Q2.14 19.08 2.63 19.4 Q3.03 19.66 3.42 19.27 L6.63 15.98 L9.67 22.05 Q9.93 22.56 10.45 22.31 L12.58 21.28 Q13.08 21.04 12.83 20.53 L9.88 14.48 L15.42 14.17 Q16.02 14.14 16.28 13.62 Q16.47 13.21 16.08 12.9 Z" />
        </svg>
      </div>
      {children}
    </div>
  );
}
