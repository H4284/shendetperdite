import { z } from "zod";

export const heroSlideSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  cta: z.string().min(1),
  href: z.string().min(1),
  image: z.string().min(1),
  alt: z.string().min(1),
  textColor: z.enum(["dark", "light"]).optional(),
  order: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export const brandPromoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string(),
  cta: z.string().min(1),
  href: z.string().min(1),
  image: z.string().min(1),
  alt: z.string().min(1),
  order: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export const homeContentSchema = z.object({
  heroSlides: z.array(heroSlideSchema),
  brandPromos: z.array(brandPromoSchema),
  trustedBrandIds: z.array(z.string().min(1)),
});

export const companyInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
});

export const storeSettingsSchema = z.object({
  freeShippingFrom: z.number().nonnegative(),
  company: companyInfoSchema,
});

export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type BrandPromo = z.infer<typeof brandPromoSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
export type CompanyInfo = z.infer<typeof companyInfoSchema>;
export type StoreSettings = z.infer<typeof storeSettingsSchema>;
