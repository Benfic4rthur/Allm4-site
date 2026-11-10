"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const limit = (value: number) => Math.max(0, Math.min(1, value));

// Native page scrolling and CSS sticky supply the mobile handoff. Supporting
// browsers also run the content movement on their scroll animation timeline.
export function useTouchStory(
  rootRef: RefObject<HTMLDivElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
  compact: boolean,
  count: number,
) {
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const section = root?.closest<HTMLElement>("#sobre");
    if (!compact || !root || !stage || !section || !window.matchMedia("(max-width: 900px)").matches) return;

    const layers = Array.from(stage.children) as HTMLElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const supportsTimeline = CSS.supports("animation-timeline", "--studio-touch") && CSS.supports("animation-range", "contain");
    const scrollRate = .8;
    const originalTransform = stage.style.transform;
    const properties = ["--touch-story-travel", "--touch-content-travel"];
    const originalProperties = properties.map(name => section.style.getPropertyValue(name));
    let nativeTimeline = false;
    let entry = 0;
    let contentTravel = 0;
    let pageTravel = 0;
    let lastOffset = -1;
    let raf = 0;
    let needsMeasure = true;

    root.dataset.touchPinned = "true";

    const measure = () => {
      const height = root.clientHeight;
      contentTravel = Math.max(0, stage.scrollHeight - height);
      pageTravel = contentTravel * scrollRate;
      entry = section.getBoundingClientRect().top + window.scrollY;
      section.style.setProperty("--touch-story-travel", `${pageTravel}px`);
      section.style.setProperty("--touch-content-travel", `${contentTravel}px`);
      // Two visual groups per chapter share the one native timeline. These
      // ranges are layout measurements, never recalculated during scrolling.
      const stageTop = stage.getBoundingClientRect().top;
      layers.forEach(layer => {
        const rect = layer.getBoundingClientRect();
        const top = rect.top - stageTop;
        const distance = Math.max(1, contentTravel);
        layer.style.setProperty("--touch-scene-start", `${((top - height) / distance) * 100}%`);
        layer.style.setProperty("--touch-scene-end", `${((top + rect.height) / distance) * 100}%`);
      });
      nativeTimeline = supportsTimeline && !reduced.matches && contentTravel > 0;
      root.dataset.touchNativeTimeline = String(nativeTimeline);
      lastOffset = -1;
      // No per-scroll JavaScript at all on the native timeline path.
      window.removeEventListener("scroll", requestPaint);
      if (nativeTimeline) {
        stage.style.transform = originalTransform;
        delete root.dataset.touchScroll;
        delete root.dataset.touchProgress;
      } else {
        window.addEventListener("scroll", requestPaint, { passive: true });
      }
    };

    const paint = () => {
      raf = 0;
      if (needsMeasure) {
        needsMeasure = false;
        measure();
      }
      if (nativeTimeline) return;
      // Older browsers only update one transform. No layout reads, per-piece
      // animations, opacity changes, or React updates occur during scrolling.
      const progress = pageTravel > 0 ? limit((window.scrollY - entry) / pageTravel) : 0;
      const offset = progress * contentTravel;
      if (Math.abs(offset - lastOffset) < .1) return;
      lastOffset = offset;
      stage.style.transform = `translate3d(0,${-offset}px,0)`;
      root.dataset.touchScroll = offset.toFixed(1);
      root.dataset.touchProgress = progress.toFixed(5);
    };

    function requestPaint() {
      if (!raf) raf = requestAnimationFrame(paint);
    }
    const requestMeasure = () => {
      needsMeasure = true;
      requestPaint();
    };
    const onViewportResize = () => {
      // Safari's address bar can resize the visual viewport during a swipe.
      // Native timelines already account for that; real layout changes are
      // observed below, without remeasuring for every toolbar movement.
      if (!nativeTimeline) requestMeasure();
    };
    // Sparse chapter reporting, independent from the animation itself.
    const visibleHeights = new Map<Element, number>();
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(item => visibleHeights.set(item.target, item.intersectionRect.height));
      let chapter = layers[0];
      let largest = 0;
      layers.forEach(layer => {
        const height = visibleHeights.get(layer) ?? 0;
        if (height > largest) { largest = height; chapter = layer; }
      });
      const label = chapter?.getAttribute("aria-label") ?? "";
      if (root.dataset.touchChapter !== label) root.dataset.touchChapter = label;
    }, { root, threshold: [0, .25, .5, .75, 1] });
    layers.forEach(layer => visibility.observe(layer));

    const observer = new ResizeObserver(requestMeasure);
    observer.observe(root);
    observer.observe(stage);
    layers.forEach(layer => observer.observe(layer));
    window.addEventListener("resize", onViewportResize, { passive: true });
    stage.addEventListener("toggle", requestMeasure, true);
    reduced.addEventListener("change", requestMeasure);
    requestPaint();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", requestPaint);
      window.removeEventListener("resize", onViewportResize);
      stage.removeEventListener("toggle", requestMeasure, true);
      reduced.removeEventListener("change", requestMeasure);
      stage.style.transform = originalTransform;
      properties.forEach((name, index) => {
        if (originalProperties[index]) section.style.setProperty(name, originalProperties[index]);
        else section.style.removeProperty(name);
      });
      layers.forEach(layer => {
        layer.style.removeProperty("--touch-scene-start");
        layer.style.removeProperty("--touch-scene-end");
      });
      delete root.dataset.touchPinned;
      delete root.dataset.touchNativeTimeline;
      delete root.dataset.touchChapter;
      delete root.dataset.touchScroll;
      delete root.dataset.touchProgress;
    };
  }, [compact, count, rootRef, stageRef]);
}
