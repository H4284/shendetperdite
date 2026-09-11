import { roundMoney } from "@/lib/cart/money";
import { hasFreeShipping } from "@/lib/cart/selectors";
import type { AppliedDiscount } from "@/types/cart";
import type { ShippingMethod } from "@/types/checkout";

export function shippingCostFor(
  subtotal: number,
  method: ShippingMethod,
  discount?: AppliedDiscount | null,
) {
  if (hasFreeShipping(subtotal, discount, method.freeFrom ?? Number.POSITIVE_INFINITY)) {
    return 0;
  }
  return roundMoney(method.price);
}

export function orderTotal(
  subtotal: number,
  discountAmount: number,
  shippingCost: number,
) {
  return roundMoney(Math.max(0, subtotal - discountAmount + shippingCost));
}
