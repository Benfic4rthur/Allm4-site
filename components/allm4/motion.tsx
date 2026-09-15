"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function MotionRoot({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const activate = () => {
      observer?.disconnect();
      el.querySelectorAll(".reveal").forEach((n) =>
        n.classList.remove("reveal-pending"),
      );
      if (media.matches) return;
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
      if (media.matches || e.pointerType !== "mouse" || window.innerWidth < 900)
        return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--pointer-x", `${x * 9}px`);
        el.style.setProperty("--pointer-y", `${y * 7}px`);
      });
    };
    activate();
    media.addEventListener("change", activate);
    el.addEventListener("pointermove", move, { passive: true });
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      media.removeEventListener("change", activate);
      el.removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <div ref={root} className="site-motion">
      {children}
    </div>
  );
}
