import { siteConfig } from "@/config/site";
import { roundMoney } from "@/lib/cart/money";
import type { AppliedDiscount, CartItem } from "@/types/cart";

export function cartSubtotal(items: CartItem[]) {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.qty, 0));
}

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function discountAmount(
  subtotal: number,
  discount: AppliedDiscount | null | undefined,
) {
  if (!discount || subtotal <= 0) return 0;
  if (discount.type === "percent") {
    return roundMoney((subtotal * discount.value) / 100);
  }
  if (discount.type === "fixed") {
    return Math.min(subtotal, roundMoney(discount.value));
  }
  return 0;
}

export function cartTotal(
  items: CartItem[],
  discount: AppliedDiscount | null | undefined,
) {
  const subtotal = cartSubtotal(items);
  return roundMoney(Math.max(0, subtotal - discountAmount(subtotal, discount)));
}

export function freeShippingRemaining(
  subtotal: number,
  threshold: number = siteConfig.freeShippingFrom,
) {
  return roundMoney(Math.max(0, threshold - subtotal));
}

export function hasFreeShipping(
  subtotal: number,
  discount: AppliedDiscount | null | undefined,
  threshold: number = siteConfig.freeShippingFrom,
) {
  return discount?.type === "free_shipping" || subtotal >= threshold;
}
