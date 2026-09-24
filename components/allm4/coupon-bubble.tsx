"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import {
  couponDisplayDuration,
  formatCouponDiscount,
  orderPublicCoupons,
  parsePublicCoupons,
  type PublicCoupon,
} from "@/lib/public-coupons";

const couponsUrl = "https://allm4-license-server.vercel.app/api/public/coupons";

export function CouponBubble() {
  const [coupons, setCoupons] = useState<PublicCoupon[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState(false);
  const [visible, setVisible] = useState(true);
  const cardRef = useRef<HTMLElement>(null);
  const currentCoupons = useRef<PublicCoupon[]>([]);
  const pendingCoupons = useRef<PublicCoupon[] | null>(null);
  const openRef = useRef(false);
  const remainingMs = useRef(couponDisplayDuration(0));
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyCoupons = useCallback((next: PublicCoupon[]) => {
    const previous = currentCoupons.current;
    const changed = next.length !== previous.length || next.some((item, position) =>
      item.code !== previous[position]?.code ||
      item.discount_type !== previous[position]?.discount_type ||
      item.discount_value !== previous[position]?.discount_value
    );
    if (!changed) return;
    currentCoupons.current = next;
    remainingMs.current = couponDisplayDuration(0);
    setCoupons(next);
    setIndex(0);
    setNotice(false);
    if (!next.length) {
      openRef.current = false;
      setOpen(false);
    }
  }, []);

  const closeCard = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    if (pendingCoupons.current) {
      applyCoupons(pendingCoupons.current);
      pendingCoupons.current = null;
    }
  }, [applyCoupons]);

  useEffect(() => {
    let active = true;
    let loading = false;
    let lastAttemptAt = 0;
    let controller: AbortController | null = null;

    async function loadCoupons() {
      if (!active || loading) return;
      loading = true;
      lastAttemptAt = Date.now();
      const request = new AbortController();
      controller = request;
      const timeout = window.setTimeout(() => request.abort(), 8000);

      try {
        const response = await fetch(couponsUrl, {
          signal: request.signal,
          cache: "no-store",
          credentials: "omit",
          referrerPolicy: "no-referrer",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error("Coupon response unavailable");
        }
        const data: unknown = await response.json();
        if (active) {
          const next = orderPublicCoupons(parsePublicCoupons(data));
          if (openRef.current && next.length) {
            pendingCoupons.current = next;
          } else {
            pendingCoupons.current = null;
            applyCoupons(next);
          }
        }
      } catch {
        if (active) {
          pendingCoupons.current = null;
          applyCoupons([]);
        }
      } finally {
        window.clearTimeout(timeout);
        if (controller === request) controller = null;
        loading = false;
      }
    }

    const refreshIfStale = () => {
      if (document.visibilityState === "visible" && Date.now() - lastAttemptAt >= 60_000) {
        void loadCoupons();
      }
    };
    void loadCoupons();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadCoupons();
    }, 5 * 60_000);
    document.addEventListener("visibilitychange", refreshIfStale);
    window.addEventListener("focus", refreshIfStale);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfStale);
      window.removeEventListener("focus", refreshIfStale);
      controller?.abort();
    };
  }, [applyCoupons]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) closeCard();
    };
    const onScroll = () => closeCard();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCard();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeCard]);

  useEffect(() => {
    const onVisibilityChange = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (coupons.length < 2 || open || !visible) return;
    const startedAt = Date.now();
    let running = true;
    const timer = window.setTimeout(() => {
      running = false;
      const next = (index + 1) % coupons.length;
      remainingMs.current = couponDisplayDuration(next);
      setIndex(next);
      setCopied(false);
      setNotice(true);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      noticeTimer.current = setTimeout(() => setNotice(false), 4000);
    }, remainingMs.current);

    return () => {
      window.clearTimeout(timer);
      if (running) remainingMs.current = Math.max(0, remainingMs.current - (Date.now() - startedAt));
    };
  }, [coupons, index, open, visible]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
  }, []);

  if (!coupons.length) return null;
  const coupon = coupons[index] ?? coupons[0];

  async function copyCoupon() {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside ref={cardRef} className={`coupon-float${open ? " coupon-float-open" : ""}`} aria-label="Cupons Allm4">
      {!open ? (
        <>
          {notice && <span className="coupon-notice" role="status">Novo cupom disponível</span>}
          <button className="coupon-teaser" type="button" onClick={() => { openRef.current = true; setOpen(true); }} aria-label="Ver cupom disponível">
            <span className="coupon-icon" aria-hidden="true" />
            <span>Ei, tem algo pra você <span className="coupon-teaser-arrow" aria-hidden="true">↗</span></span>
          </button>
        </>
      ) : (
        <div className="coupon-card">
          <div className="coupon-card-top">
            <span className="coupon-icon" aria-hidden="true" />
            <button className="coupon-close" type="button" onClick={closeCard} aria-label="Recolher cupom">
              <X size={17} />
            </button>
          </div>
          <p className="coupon-kicker">UM PRESENTE PARA VOCÊ</p>
          <h2>Você recebeu um cupom!</h2>
          <p className="coupon-discount">{formatCouponDiscount(coupon)}</p>
          <div className="coupon-code" aria-label={`Código do cupom: ${coupon.code}`}>{coupon.code}</div>
          <button className="coupon-copy" type="button" onClick={copyCoupon}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Cupom copiado" : "Copiar cupom"}
          </button>
        </div>
      )}
    </aside>
  );
}
