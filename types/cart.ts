import { z } from "zod";
import { discountTypeSchema } from "@/types/discount";

export const cartItemSchema = z.object({
  variantId: z.string().min(1),
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  variantLabel: z.string(),
  image: z.string().url().nullable(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable(),
  qty: z.number().int().positive(),
  maxQty: z.number().int().nonnegative(),
});

export const appliedDiscountSchema = z.object({
  code: z.string().min(1),
  type: discountTypeSchema,
  value: z.number().nonnegative(),
});

export const cartRequestItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  qty: z.number().int().positive().default(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type AppliedDiscount = z.infer<typeof appliedDiscountSchema>;
export type CartRequestItem = z.infer<typeof cartRequestItemSchema>;

export type CartClamp = {
  variantId: string;
  requested: number;
  qty: number;
};

export type ValidateCartResult = {
  items: CartItem[];
  clamped: CartClamp[];
};
