import test from "node:test";
import assert from "node:assert/strict";
import {
  couponDisplayDuration,
  formatCouponDiscount,
  orderPublicCoupons,
  parsePublicCoupons,
} from "../lib/public-coupons.ts";

const now = Date.parse("2026-09-24T12:00:00Z");
const percent = {
  code: "LANCAMENTO20",
  discount_type: "percent",
  discount_value: 20,
  starts_at: "2026-09-23T02:27:00.000Z",
  expires_at: "2026-11-01T02:27:00.000Z",
};

test("accepts currently published coupons and formats their discounts", () => {
  const coupons = parsePublicCoupons({ ok: true, coupons: [percent, {
    code: "DEZREAIS", discount_type: "fixed", discount_value: 1000,
  }] }, now);
  assert.equal(coupons.length, 2);
  assert.equal(formatCouponDiscount(coupons[0]), "20% de desconto");
  assert.equal(formatCouponDiscount(coupons[1]), "R$ 10,00 de desconto");
});

test("hides invalid, unpublished, future, and expired coupons", () => {
  assert.deepEqual(parsePublicCoupons(null, now), []);
  assert.deepEqual(parsePublicCoupons({ ok: false, coupons: [percent] }, now), []);
  assert.deepEqual(parsePublicCoupons({ ok: true, coupons: "invalid" }, now), []);
  assert.deepEqual(parsePublicCoupons({ ok: true, coupons: [
    { ...percent, starts_at: "2026-10-01T00:00:00Z" },
    { ...percent, expires_at: "2026-09-01T00:00:00Z" },
    { ...percent, discount_value: NaN },
    { ...percent, code: "" },
    { ...percent, discount_type: "other" },
    percent,
  ] }, now), [{ code: "LANCAMENTO20", discount_type: "percent", discount_value: 20 }]);
});

test("rotates percent coupons from the smallest discount, with shorter later slots", () => {
  const coupons = [30, 40, 20].map((discount_value) => ({
    code: `CUPOM${discount_value}`,
    discount_type: "percent",
    discount_value,
  }));
  assert.deepEqual(orderPublicCoupons(coupons).map(({ code }) => code), ["CUPOM20", "CUPOM30", "CUPOM40"]);
  assert.deepEqual([0, 1, 2].map(couponDisplayDuration), [360_000, 180_000, 45_000]);
  assert.equal(couponDisplayDuration(3), 45_000);
});
