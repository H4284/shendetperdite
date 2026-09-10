import { z } from "zod";

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const catalogImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
  order: z.number().int().nonnegative(),
});

export const productOptionSchema = z.object({
  name: z.string().min(1),
  values: z.array(z.string().min(1)).min(1),
});

export const productUnitSchema = z.object({
  amount: z.number().positive(),
  unit: z.string().min(1),
});

export const productStatusSchema = z.enum(["draft", "active", "archived"]);

export const categoryDocumentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string(),
  image: z.string().url().nullable(),
  parentId: z.string().min(1).nullable(),
  order: z.number().int().nonnegative(),
  isActive: z.boolean(),
  seo: seoSchema,
});

export const brandDocumentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  logo: z.string().url().nullable(),
  description: z.string(),
  isActive: z.boolean(),
  seo: seoSchema,
});

export const productDocumentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  brandId: z.string().min(1),
  categoryIds: z.array(z.string().min(1)).min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  images: z.array(catalogImageSchema),
  options: z.array(productOptionSchema).max(2),
  basePrice: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable(),
  unit: productUnitSchema.nullable(),
  status: productStatusSchema,
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  relatedProductIds: z.array(z.string().min(1)),
  searchTokens: z.array(z.string().min(1)),
  minPrice: z.number().nonnegative(),
  maxPrice: z.number().nonnegative(),
  totalStock: z.number().int().nonnegative(),
  defaultVariantId: z.string().min(1).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const variantDocumentSchema = z.object({
  sku: z.string().min(1),
  optionValues: z.record(z.string().min(1), z.string().min(1)),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable(),
  stockQty: z.number().int().nonnegative(),
  isDefault: z.boolean(),
  image: z.string().url().nullable(),
});

export const categorySchema = categoryDocumentSchema.extend({
  id: z.string().min(1),
});

export const brandSchema = brandDocumentSchema.extend({
  id: z.string().min(1),
});

export const productSchema = productDocumentSchema.extend({
  id: z.string().min(1),
});

export const variantSchema = variantDocumentSchema.extend({
  id: z.string().min(1),
});

export type Seo = z.infer<typeof seoSchema>;
export type CatalogImage = z.infer<typeof catalogImageSchema>;
export type ProductOption = z.infer<typeof productOptionSchema>;
export type ProductUnit = z.infer<typeof productUnitSchema>;
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Brand = z.infer<typeof brandSchema>;
export type Product = z.infer<typeof productSchema>;
export type Variant = z.infer<typeof variantSchema>;

export type CategoryTreeNode = Category & { children: CategoryTreeNode[] };
export type ProductWithVariants = Product & { variants: Variant[] };

export type ProductSort = "newest" | "price-asc" | "price-desc";

export type ListProductsInput = {
  categoryId?: string;
  brandId?: string;
  page?: number;
  pageSize?: number;
  sort?: ProductSort;
};

export type ListProductsResult = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
};
