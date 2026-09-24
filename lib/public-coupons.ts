export type PublicCoupon = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
};

export function orderPublicCoupons(coupons: PublicCoupon[]): PublicCoupon[] {
  return [...coupons].sort((a, b) => {
    if (a.discount_type !== b.discount_type) return a.discount_type === "percent" ? -1 : 1;
    return a.discount_value - b.discount_value;
  });
}

export function couponDisplayDuration(index: number): number {
  return [360_000, 180_000, 45_000][index] ?? 45_000;
}

export function parsePublicCoupons(value: unknown, now = Date.now()): PublicCoupon[] {
  if (!value || typeof value !== "object") return [];
  const response = value as { ok?: unknown; coupons?: unknown };
  if (response.ok !== true || !Array.isArray(response.coupons)) return [];

  return response.coupons.flatMap((item: unknown) => {
    if (!item || typeof item !== "object") return [];
    const coupon = item as Record<string, unknown>;
    if (
      typeof coupon.code !== "string" ||
      !coupon.code.trim() ||
      coupon.code.length > 100 ||
      (coupon.discount_type !== "percent" && coupon.discount_type !== "fixed") ||
      typeof coupon.discount_value !== "number" ||
      !Number.isFinite(coupon.discount_value) ||
      coupon.discount_value <= 0
    ) return [];

    if (coupon.discount_type === "percent" && coupon.discount_value > 100) return [];
    if (coupon.discount_type === "fixed" && !Number.isInteger(coupon.discount_value)) return [];

    for (const [field, isStart] of [["starts_at", true], ["expires_at", false]] as const) {
      const date = coupon[field];
      if (date == null) continue;
      if (typeof date !== "string") return [];
      const timestamp = Date.parse(date);
      if (!Number.isFinite(timestamp) || (isStart ? timestamp > now : timestamp <= now)) return [];
    }

    return [{
      code: coupon.code.trim(),
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
    }];
  });
}

export function formatCouponDiscount(coupon: PublicCoupon): string {
  if (coupon.discount_type === "percent") {
    const amount = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(coupon.discount_value);
    return `${amount}% de desconto`;
  }
  const amount = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(coupon.discount_value / 100);
  return `${amount} de desconto`;
}
