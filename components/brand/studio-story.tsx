"use client";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import { Children, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useTouchStory } from "./use-touch-story";

type StudioStoryProps = {
  chapters: readonly string[];
  children: ReactNode;
};

type Frame = { from: number; to: number; current: number; reduced: boolean };
type ScrubPiece = { animation: Animation; opacityAnimation: Animation; element: HTMLElement; willChange: string; entering: boolean; start: number; end: number; progress: number };

const PIECES = [
  "h2", ".studio-about-copy > p", ".studio-about-links", ".studio-about-signature",
  ".studio-story-principles", ".profile-hero-copy > p", ".profile-hero-links",
  ".profile-portrait", ".profile-section-intro > p", ".profile-job", ".profile-earlier", ".profile-timeline-rule",
  ".profile-education article", ".profile-languages", ".profile-skill-group", ".profile-skill-more",
  ".profile-case-name", ".profile-case-story > div", ".profile-case-technologies",
  ".profile-case-copy > a", ".profile-license-app", ".profile-license-service",
  ".profile-license-connector", ".profile-license-figure > figcaption", ".profile-copy-figure",
  ".profile-trackpad", ".profile-trackpad-figure > figcaption", ".profile-closing > div > p",
].join(",");

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const COMPACT_QUERY = "(max-width: 900px)";
function subscribeCompact(onChange: () => void) {
  const media = window.matchMedia(COMPACT_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const compactSnapshot = () => window.matchMedia(COMPACT_QUERY).matches;
const serverCompactSnapshot = () => true;

function piecesOf(panel: HTMLElement) {
  const bounds = panel.getBoundingClientRect();
  const candidates = Array.from(panel.querySelectorAll<HTMLElement>(PIECES)).filter(piece => {
    const rect = piece.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > bounds.top && rect.top < bounds.bottom;
  });
  return candidates.filter(piece => !candidates.some(parent => parent !== piece && parent.contains(piece)));
}

export function StudioStory({ chapters, children }: StudioStoryProps) {
  useSiteLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const compact = useSyncExternalStore(subscribeCompact, compactSnapshot, serverCompactSnapshot);
  const [frame, setFrame] = useState<Frame>({ from: 0, to: 0, current: 0, reduced: false });

  useTouchStory(rootRef, stageRef, compact, count);

  useEffect(() => {
    // The native mobile scroller has its own motion and never uses this lock.
    if (compact) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    const section = stage?.closest<HTMLElement>("#sobre");
    if (!root || !stage || !section || !count) return;

    const layers = Array.from(stage.children) as HTMLElement[];
    const panels = layers.map(layer => layer.querySelector<HTMLElement>(".studio-story-panel")!);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const last = count - 1;
    let position = 0;
    let visualPosition = 0;
    let paintedPosition = 0;
    let lastPaintTime = 0;
    let renderFrame = 0;
    let pair = "";
    let visible = [0];
    let currentFrame: Frame | undefined;
    let effects: ScrubPiece[] = [];
    const pieceCache = new Map<HTMLElement, { key: string; pieces: HTMLElement[] }>();
    let touch: { x: number; y: number } | null = null;
    let locked = false;
    let anchorY = 0;
    let pendingDelta = 0;
    let previousPageY = window.scrollY;
    const page = document.documentElement;
    const originalOverflow = page.style.overflowY;
    const originalOverscroll = page.style.overscrollBehaviorY;

    const span = () => clamp(window.innerHeight * .85, 520, 900);
    // The handoff is the section's bottom meeting the viewport's bottom.
    const distanceToEntry = () => section.getBoundingClientRect().bottom - window.innerHeight;

    const clearEffects = () => {
      effects.forEach(effect => {
        effect.animation.cancel();
        effect.opacityAnimation.cancel();
        effect.element.style.willChange = effect.willChange;
      });
      effects = [];
    };

    const preparePieces = (panel: HTMLElement, entering: boolean) => {
      const key = [panel.clientWidth, panel.clientHeight, panel.scrollTop, ...Array.from(panel.querySelectorAll("details"), detail => Number(detail.open))].join(":");
      let cached = pieceCache.get(panel);
      if (cached?.key !== key) {
        cached = { key, pieces: piecesOf(panel) };
        pieceCache.set(panel, cached);
      }
      const pieces = cached.pieces;
      return pieces.map((piece, index): ScrubPiece => {
        const willChange = piece.style.willChange;
        piece.style.willChange = "transform, opacity";
        const visual = piece.matches("figure,.studio-about-signature,.profile-license-app,.profile-license-service,.profile-trackpad");
        const sideways = visual || piece.matches(".profile-job,.profile-skill-group");
        const flip = piece.matches(".profile-license-service,.profile-skill-group:nth-child(even)") ? -1 : 1;
        const x = sideways ? (visual ? 38 : 24) * flip * (entering ? 1 : -1) : 0;
        const y = sideways ? (entering ? 12 : -10) : (entering ? 22 : -18);
        const displaced = media.matches ? "none" : "perspective(1100px) translate3d(" + x + "px," + y + "px," + (visual ? -20 : 0) + "px) rotateY(" + (visual ? (entering ? -3 : 3) * flip : 0) + "deg) scale(" + (visual ? .985 : .995) + ")";
        const animation = piece.animate(
          entering
            ? [{ transform: displaced }, { transform: "none" }]
            : [{ transform: "none" }, { transform: displaced }],
          { duration: 1000, fill: "both", easing: "linear" },
        );
        // No playback or timer: currentTime is set only by the scroll position.
        animation.pause();
        animation.currentTime = 0;
        const opacityAnimation = piece.animate(
          entering ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
          { duration: 1000, fill: "both", easing: "linear" },
        );
        opacityAnimation.pause();
        opacityAnimation.currentTime = 0;
        const stagger = pieces.length > 1 ? (index / (pieces.length - 1)) * .16 : 0;
        const start = entering ? .28 + stagger * .6 : .02 + stagger * .5;
        return { animation, opacityAnimation, element: piece, willChange, entering, start, end: start + (entering ? .42 : .27), progress: -1 };
      });
    };

    const paint = () => {
      renderFrame = 0;
      const rounded = Math.round(position);
      if (Math.abs(position - rounded) < .000001) position = rounded;
      const reduced = media.matches;
      const now = performance.now();
      const elapsed = !lastPaintTime || now - lastPaintTime > 90 ? 1000 / 60 : Math.min(40, now - lastPaintTime);
      lastPaintTime = now;
      // Interpolate wheel packets at the display refresh rate, without advancing
      // the target or completing a chapter when input stops.
      if (!locked) visualPosition = position;
      else visualPosition += (position - visualPosition) * (1 - Math.exp(-elapsed / 42));
      if (Math.abs(visualPosition - position) < .0005) visualPosition = position;
      const from = Math.floor(visualPosition);
      const to = Math.ceil(visualPosition);
      const current = Math.round(visualPosition);
      const nextVisible = from === to ? [from] : [from, to];
      const nextPair = from + ":" + to + ":" + reduced;

      if (nextPair !== pair) {
        const direction = visualPosition >= paintedPosition ? 1 : -1;
        const arriving = direction > 0 ? to : from;
        if (!visible.includes(arriving)) {
          const panel = panels[arriving];
          panel.scrollTop = direction > 0 ? 0 : Math.max(0, panel.scrollHeight - panel.clientHeight);
        }
        // Commit visibility before clearing effects, avoiding a one-frame flash.
        layers.forEach((layer, index) => {
          layer.dataset.storyVisible = String(nextVisible.includes(index));
          layer.dataset.storyActive = String(index === current);
          layer.inert = index !== current;
          layer.setAttribute("aria-hidden", String(index !== current));
        });
        clearEffects();
        pair = nextPair;
        visible = nextVisible;
        if (from !== to) {
          effects = [...preparePieces(panels[from], false), ...preparePieces(panels[to], true)];
        }
      }

      const progress = visualPosition - from;
      effects.forEach(effect => {
        const part = clamp((progress - effect.start) / (effect.end - effect.start));
        if (Math.abs(part - effect.progress) < .00001) return;
        effect.progress = part;
        effect.opacityAnimation.currentTime = (effect.entering ? part * (2 - part) : 1 - Math.pow(1 - part, 1.15)) * 1000;
        effect.animation.currentTime = (part * part * (3 - 2 * part)) * 1000;
      });
      root.dataset.storyPosition = position.toFixed(6);
      root.dataset.storyVisualPosition = visualPosition.toFixed(6);
      root.dataset.storyPhase = from === to ? "reading" : "scrubbing";
      paintedPosition = visualPosition;

      if (!currentFrame || currentFrame.from !== from || currentFrame.to !== to || currentFrame.current !== current || currentFrame.reduced !== reduced) {
        currentFrame = { from, to, current, reduced };
        setFrame(currentFrame);
      }
      if (locked && visualPosition !== position) requestPaint();
    };

    const requestPaint = () => {
      if (!renderFrame) renderFrame = requestAnimationFrame(() => {
        const delta = pendingDelta;
        pendingDelta = 0;
        if (delta) consume(delta);
        paint();
      });
    };

    // Spend each pixel once: long content, then the transition, then the page.
    const consume = (delta: number) => {
      let remaining = delta;
      const direction = Math.sign(delta);
      for (let step = 0; step < count * 2 + 2 && Math.abs(remaining) > .001; step++) {
        const rounded = Math.round(position);
        if (Math.abs(position - rounded) < .000001) {
          position = rounded;
          const panel = panels[rounded];
          const available = direction > 0
            ? Math.max(0, panel.scrollHeight - panel.clientHeight - panel.scrollTop)
            : panel.scrollTop;
          const reading = Math.min(Math.abs(remaining), available);
          if (reading > .001) {
            panel.scrollTop += reading * direction;
            remaining -= reading * direction;
          }
          if (Math.abs(remaining) < .001 || (direction < 0 && position === 0) || (direction > 0 && position === last)) break;
        }

        const destination = clamp(direction > 0 ? Math.floor(position + .000001) + 1 : Math.ceil(position - .000001) - 1, 0, last);
        const distance = Math.abs(destination - position) * span();
        const used = Math.min(Math.abs(remaining), distance);
        position += used * direction / span();
        remaining -= used * direction;
        if (Math.abs(position - destination) < .000001) {
          position = destination;
          const arrived = panels[destination];
          arrived.scrollTop = direction > 0 ? 0 : Math.max(0, arrived.scrollHeight - arrived.clientHeight);
        }
      }
      return remaining;
    };

    const unlockPage = () => {
      locked = false;
      pendingDelta = 0;
      page.style.overflowY = originalOverflow;
      page.style.overscrollBehaviorY = originalOverscroll;
      root.dataset.storyLocked = "false";
    };

    const lockPage = (direction: number, boundary: number) => {
      position = direction > 0 ? 0 : last;
      visualPosition = position;
      pendingDelta = 0;
      anchorY = boundary;
      locked = true;
      page.style.overflowY = "hidden";
      page.style.overscrollBehaviorY = "none";
      root.dataset.storyLocked = "true";
      const panel = panels[Math.round(position)];
      panel.scrollTop = direction > 0 ? 0 : Math.max(0, panel.scrollHeight - panel.clientHeight);
      if (Math.abs(window.scrollY - anchorY) > .5) window.scrollTo({ top: anchorY, behavior: "instant" });
      previousPageY = window.scrollY;
      requestPaint();
    };

    const onPageScroll = () => {
      if (locked) {
        if (Math.abs(window.scrollY - anchorY) > .5) window.scrollTo({ top: anchorY, behavior: "instant" });
        previousPageY = window.scrollY;
        return;
      }
      const distance = distanceToEntry();
      const boundary = window.scrollY + distance;
      if (previousPageY < boundary - 1 && window.scrollY >= boundary - 1) {
        lockPage(1, boundary);
        return;
      }
      if (previousPageY > boundary + 1 && window.scrollY <= boundary + 1) {
        lockPage(-1, boundary);
        return;
      }
      const edge = distance > 1 ? 0 : distance < -1 ? last : null;
      if (edge !== null && position !== edge) {
        position = edge;
        requestPaint();
      }
      previousPageY = window.scrollY;
    };

    const processDelta = (delta: number) => {
      if (!delta) return false;
      if (locked) {
        const panel = panels[Math.round(position)];
        const exhausted = delta < 0
          ? position <= .000001 && visualPosition <= .02 && panel.scrollTop <= 1
          : position >= last - .000001 && visualPosition >= last - .18 && panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
        if (exhausted && Math.abs(pendingDelta) < .001) {
          unlockPage();
          window.scrollBy({ top: delta, behavior: "instant" });
          return true;
        }
        // Bound accelerated wheel bursts per painted frame, never skip scenes.
        pendingDelta = clamp(pendingDelta + delta, -100, 100);
        requestPaint();
        return true;
      }

      const distance = distanceToEntry();
      const boundary = window.scrollY + distance;
      if (distance > 1) {
        if (delta <= 0 || delta < distance) return false;
        lockPage(1, boundary);
        pendingDelta = clamp(delta - distance, 0, 100);
        return true;
      }
      if (distance < -1) {
        if (delta >= 0 || delta > distance) return false;
        lockPage(-1, boundary);
        pendingDelta = clamp(delta - distance, -100, 0);
        return true;
      }

      if ((delta < 0 && position <= .000001) || (delta > 0 && position >= last - .000001)) return false;
      lockPage(delta > 0 ? 1 : -1, boundary);
      pendingDelta = clamp(delta, -100, 100);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (processDelta(delta)) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("input,textarea,select,button,summary,[contenteditable='true'],[role='textbox']")) return;
      const page = window.innerHeight * .85;
      const delta = event.key === "ArrowDown" ? 48 : event.key === "ArrowUp" ? -48
        : event.key === "PageDown" ? page : event.key === "PageUp" ? -page
          : event.key === " " ? (event.shiftKey ? -page : page) : 0;
      if (processDelta(delta)) event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touch || event.touches.length !== 1) return;
      const point = event.touches[0];
      const delta = touch.y - point.clientY;
      const horizontal = Math.abs(touch.x - point.clientX);
      touch = { x: point.clientX, y: point.clientY };
      if (Math.abs(delta) >= horizontal && processDelta(delta)) event.preventDefault();
    };
    const onTouchEnd = () => { touch = null; };
    const onMotionChange = () => { pair = ""; requestPaint(); };
    const resizeObserver = new ResizeObserver(() => {
      if (locked) {
        anchorY = window.scrollY + distanceToEntry();
        window.scrollTo({ top: anchorY, behavior: "instant" });
        previousPageY = window.scrollY;
      }
      pair = "";
      requestPaint();
    });

    if (distanceToEntry() < -1) position = last;
    paint();
    resizeObserver.observe(stage);
    window.addEventListener("scroll", onPageScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    media.addEventListener("change", onMotionChange);

    return () => {
      if (renderFrame) cancelAnimationFrame(renderFrame);
      unlockPage();
      clearEffects();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onPageScroll);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      media.removeEventListener("change", onMotionChange);
    };
  }, [count, compact]);

  return localizeTree((
    <div className="studio-story" data-story-layout={compact ? "touch" : "scrub"} ref={rootRef}>
      <div className="studio-story-scroll" ref={stageRef} tabIndex={0} role="region" aria-label="Apresentação sobre Arthur Benfica e o ALLM4">
        {slides.map((slide, index) => (
          <div
            className="studio-story-slide"
            data-story-visible={index === frame.from || index === frame.to}
            data-story-active={index === frame.current}
            inert={!compact && index !== frame.current}
            aria-hidden={!compact && index !== frame.current}
            key={chapters[index] ?? index}
            role="group"
            aria-label={chapters[index]}
          >
            <div className="studio-story-panel">{slide}</div>
          </div>
        ))}
      </div>
      <span className="profile-sr-only" aria-live={compact ? "off" : "polite"} aria-atomic="true">{chapters[frame.current]}</span>
    </div>
  ));
}
