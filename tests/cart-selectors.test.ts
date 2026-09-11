import { describe, expect, it } from "vitest";
import {
  cartItemCount,
  cartSubtotal,
  cartTotal,
  discountAmount,
  freeShippingRemaining,
  hasFreeShipping,
} from "../lib/cart/selectors";
import type { CartItem } from "../types/cart";

const item = (
  partial: Partial<CartItem> & Pick<CartItem, "variantId" | "price" | "qty">,
): CartItem => ({
  productId: "p1",
  sku: "SKU",
  name: "Whey",
  slug: "whey",
  variantLabel: "Cookie & Cream / 400g",
  image: null,
  compareAtPrice: null,
  maxQty: 10,
  ...partial,
});

describe("cart selectors", () => {
  it("sums line totals and item counts", () => {
    const items = [
      item({ variantId: "a", price: 22, qty: 2 }),
      item({ variantId: "b", price: 10, qty: 1 }),
    ];
    expect(cartSubtotal(items)).toBe(54);
    expect(cartItemCount(items)).toBe(3);
  });

  it("applies percent and fixed discounts to the subtotal", () => {
    expect(discountAmount(50, { code: "SAVE10", type: "percent", value: 10 })).toBe(5);
    expect(discountAmount(12, { code: "WELCOME5", type: "fixed", value: 5 })).toBe(5);
    expect(discountAmount(3, { code: "WELCOME5", type: "fixed", value: 5 })).toBe(3);
    expect(discountAmount(50, { code: "FREESHIP", type: "free_shipping", value: 0 })).toBe(0);
  });

  it("returns the exact remaining amount for free shipping with 2 decimals", () => {
    expect(freeShippingRemaining(22)).toBe(28);
    expect(freeShippingRemaining(21.5)).toBe(28.5);
    expect(freeShippingRemaining(50)).toBe(0);
    expect(freeShippingRemaining(80)).toBe(0);
  });

  it("treats free_shipping codes as free shipping even below the threshold", () => {
    expect(hasFreeShipping(20, { code: "FREESHIP", type: "free_shipping", value: 0 })).toBe(true);
    expect(hasFreeShipping(20, null)).toBe(false);
    expect(hasFreeShipping(50, null)).toBe(true);
  });

  it("computes nentotali after discount", () => {
    const items = [item({ variantId: "a", price: 22, qty: 1 })];
    expect(cartTotal(items, { code: "SAVE10", type: "percent", value: 10 })).toBe(19.8);
  });
});
