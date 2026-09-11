import type { Discount } from "@/types/discount";
import { discountAmount } from "@/lib/cart/selectors";
import type { AppliedDiscount } from "@/types/cart";

export type DiscountErrorCode =
  | "invalid"
  | "expired"
  | "not_started"
  | "min_subtotal"
  | "usage_limit";

export type DiscountValidation =
  | { ok: true; discount: AppliedDiscount }
  | { ok: false; error: DiscountErrorCode; minSubtotal?: number };

export function normalizeDiscountCode(code: string) {
  return code.trim().toUpperCase();
}

export function validateDiscount(
  discount: Discount | null | undefined,
  subtotal: number,
  now = new Date(),
): DiscountValidation {
  if (!discount || !discount.isActive) {
    return { ok: false, error: "invalid" };
  }

  if (discount.startsAt && now < discount.startsAt) {
    return { ok: false, error: "not_started" };
  }

  if (discount.endsAt && now > discount.endsAt) {
    return { ok: false, error: "expired" };
  }

  if (
    discount.usageLimit != null &&
    discount.usedCount >= discount.usageLimit
  ) {
    return { ok: false, error: "usage_limit" };
  }

  if (subtotal < discount.minSubtotal) {
    return { ok: false, error: "min_subtotal", minSubtotal: discount.minSubtotal };
  }

  return {
    ok: true,
    discount: {
      code: discount.code,
      type: discount.type,
      value: discount.value,
    },
  };
}

export function appliedDiscountAmount(
  subtotal: number,
  discount: AppliedDiscount | null | undefined,
) {
  return discountAmount(subtotal, discount);
}
