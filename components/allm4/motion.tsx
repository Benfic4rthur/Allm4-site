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
        cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
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
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #05070a;
          border: 1px solid rgba(232, 244, 255, 0.92);
          box-shadow:
            0 0 0 1px rgba(207, 228, 255, 0.18),
            0 0 9px rgba(211, 232, 255, 0.72),
            0 0 22px rgba(142, 190, 255, 0.38);
          pointer-events: none;
          z-index: 2147483000;
          opacity: 0;
          transition: opacity 100ms ease;
          will-change: transform;
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
      <div ref={cursor} className="allm4-cursor" aria-hidden="true" />
      {children}
    </div>
  );
}
