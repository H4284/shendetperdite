import { describe, expect, it } from "vitest";
import { checkoutSchema, isKosovoPhone, normalizePhone } from "../lib/checkout/schema";
import { defaultCheckoutValues } from "../lib/checkout/schema";

describe("Kosovo phone numbers", () => {
  it("accepts +383 with spaces and eight digits", () => {
    expect(isKosovoPhone("+383 49 123 456")).toBe(true);
    expect(normalizePhone("+383 49 123 456")).toBe("+38349123456");
  });

  it("rejects a local 049 number without the country code", () => {
    expect(isKosovoPhone("049123456")).toBe(false);
  });
});

describe("checkout schema", () => {
  it("requires a billing address only when it is not the same as shipping", () => {
    const base = {
      ...defaultCheckoutValues,
      email: "blerues@example.com",
      shipping: {
        ...defaultCheckoutValues.shipping,
        recipient: "Arta Krasniqi",
        line1: "Rruga B 12",
        phone: "+383 49 123 456",
      },
    };
    expect(checkoutSchema.safeParse(base).success).toBe(true);
    expect(
      checkoutSchema.safeParse({
        ...base,
        sameBillingAddress: false,
        billing: undefined,
      }).success,
    ).toBe(false);
  });
});
