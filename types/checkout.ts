import { z } from "zod";

export const shippingMethodSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  freeFrom: z.number().nonnegative().nullable(),
  eta: z.string().min(1),
  isActive: z.boolean(),
});

export const paymentMethodSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  type: z.enum(["cash_on_delivery", "card"]),
  isActive: z.boolean(),
});

export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
