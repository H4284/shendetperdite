import { z } from "zod";

export const discountTypeSchema = z.enum(["percent", "fixed", "free_shipping"]);

export const discountDocumentSchema = z.object({
  type: discountTypeSchema,
  value: z.number().nonnegative(),
  minSubtotal: z.number().nonnegative(),
  startsAt: z.date().nullable(),
  endsAt: z.date().nullable(),
  usageLimit: z.number().int().positive().nullable(),
  usedCount: z.number().int().nonnegative(),
  isActive: z.boolean(),
});

export const discountSchema = discountDocumentSchema.extend({
  code: z.string().min(1),
});

export type DiscountType = z.infer<typeof discountTypeSchema>;
export type Discount = z.infer<typeof discountSchema>;
