import { describe, expect, it } from "vitest";
import { validateDiscount } from "../lib/cart/discount";
import type { Discount } from "../types/discount";

const now = new Date("2026-09-11T10:00:00.000Z");

function discount(partial: Partial<Discount> = {}): Discount {
  return {
    code: "SAVE10",
    type: "percent",
    value: 10,
    minSubtotal: 0,
    startsAt: null,
    endsAt: null,
    usageLimit: null,
    usedCount: 0,
    isActive: true,
    ...partial,
  };
}

describe("discount validator", () => {
  it("accepts a valid percent code", () => {
    const result = validateDiscount(discount(), 40, now);
    expect(result).toEqual({
      ok: true,
      discount: { code: "SAVE10", type: "percent", value: 10 },
    });
  });

  it("rejects a missing, inactive, or unknown code", () => {
    expect(validateDiscount(null, 40, now)).toEqual({ ok: false, error: "invalid" });
    expect(validateDiscount(discount({ isActive: false }), 40, now)).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("rejects an expired code", () => {
    const result = validateDiscount(
      discount({ endsAt: new Date("2026-01-01T00:00:00.000Z") }),
      40,
      now,
    );
    expect(result).toEqual({ ok: false, error: "expired" });
  });

  it("rejects a code that has not started", () => {
    const result = validateDiscount(
      discount({ startsAt: new Date("2026-12-01T00:00:00.000Z") }),
      40,
      now,
    );
    expect(result).toEqual({ ok: false, error: "not_started" });
  });

  it("rejects a code below the minimum subtotal", () => {
    const result = validateDiscount(discount({ minSubtotal: 50 }), 22, now);
    expect(result).toEqual({ ok: false, error: "min_subtotal", minSubtotal: 50 });
  });

  it("rejects a code that reached its usage limit", () => {
    const result = validateDiscount(
      discount({ usageLimit: 10, usedCount: 10 }),
      80,
      now,
    );
    expect(result).toEqual({ ok: false, error: "usage_limit" });
  });
});
