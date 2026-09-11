import { z } from "zod";
import { KOSOVO_CITIES } from "@/data/kosovo-cities";

export function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").replace(/^\+?383/, "+383");
}

export function isKosovoPhone(value: string) {
  return /^\+383\d{8}$/.test(normalizePhone(value));
}

const addressSchema = z.object({
  country: z.literal("Kosovë"),
  city: z.string().refine((city) => (KOSOVO_CITIES as readonly string[]).includes(city), {
    message: "Zgjidhni një qytet",
  }),
  recipient: z.string().trim().min(2, "Shkruani emrin e marrësit"),
  line1: z.string().trim().min(3, "Shkruani adresën"),
  postalCode: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .refine(isKosovoPhone, "Telefoni duhet të jetë +383 dhe 8 shifra"),
});

const checkoutObjectSchema = z
  .object({
    email: z.string().trim().email("Shkruani një email të vlefshëm"),
    createAccount: z.boolean(),
    shipping: addressSchema,
    sameBillingAddress: z.boolean(),
    billing: addressSchema.optional(),
    paymentMethodId: z.string().min(1),
    shippingMethodId: z.string().min(1),
    newsletterOptIn: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (!value.sameBillingAddress && !value.billing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["billing"],
        message: "Plotësoni adresën e faturimit",
      });
    }
  });

export const checkoutSchema = z.preprocess((raw) => {
  if (!raw || typeof raw !== "object") return raw;
  const value = raw as Record<string, unknown>;
  if (value.sameBillingAddress) {
    return { ...value, billing: undefined };
  }
  return value;
}, checkoutObjectSchema);

export type CheckoutAddress = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutObjectSchema>;

const emptyAddress: CheckoutAddress = {
  country: "Kosovë",
  city: "Prishtinë",
  recipient: "",
  line1: "",
  postalCode: "",
  phone: "+383",
};

export const defaultCheckoutValues: CheckoutInput = {
  email: "",
  createAccount: false,
  shipping: { ...emptyAddress },
  sameBillingAddress: true,
  billing: { ...emptyAddress },
  paymentMethodId: "cash-on-delivery",
  shippingMethodId: "standard",
  newsletterOptIn: false,
};
