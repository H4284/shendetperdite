import { describe, expect, it } from "vitest";
import { orderTotal, shippingCostFor } from "../lib/checkout/totals";
import { defaultShippingMethods } from "../lib/checkout/defaults";

const standard = defaultShippingMethods[0];

describe("checkout shipping totals", () => {
  it("charges 2.50 € below the free-shipping threshold", () => {
    expect(shippingCostFor(22, standard, null)).toBe(2.5);
    expect(orderTotal(22, 0, 2.5)).toBe(24.5);
  });

  it("is free at a subtotal of 50 € or more", () => {
    expect(shippingCostFor(50, standard, null)).toBe(0);
    expect(shippingCostFor(80, standard, null)).toBe(0);
    expect(orderTotal(50, 0, 0)).toBe(50);
  });

  it("is free with a free_shipping discount even below 50 €", () => {
    expect(
      shippingCostFor(22, standard, { code: "FREESHIP", type: "free_shipping", value: 0 }),
    ).toBe(0);
  });
});
