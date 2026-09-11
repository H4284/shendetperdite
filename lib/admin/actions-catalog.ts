"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { optionKey } from "@/lib/admin/matrix";
import { slugify } from "@/lib/admin/slug";
import { computeProductAggregates } from "@/lib/catalog/aggregates";
import { revalidateCatalog } from "@/lib/catalog/cache";
import { buildSearchTokens } from "@/lib/catalog/search-tokens";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  brandDocumentSchema,
  categoryDocumentSchema,
  catalogImageSchema,
  productOptionSchema,
  productStatusSchema,
  productUnitSchema,
  seoSchema,
} from "@/types/catalog";

const productInputSchema = z.object({
  id: z.string().min(1).optional(),
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
  seo: seoSchema.optional(),
  variants: z.array(
    z.object({
      id: z.string().min(1).optional(),
      sku: z.string().min(1),
      optionValues: z.record(z.string(), z.string()),
      price: z.number().nonnegative(),
      compareAtPrice: z.number().nonnegative().nullable(),
      stockQty: z.number().int().nonnegative(),
      isDefault: z.boolean(),
      image: z.string().url().nullable(),
    }),
  ),
});

export async function saveProductAction(input: unknown) {
  const actor = await requireAdmin();
  const data = productInputSchema.parse(input);
  const db = getAdminDb();
  const ref = data.id
    ? db.collection("products").doc(data.id)
    : db.collection("products").doc();
  const now = new Date();
  const existing = await ref.get();
  const searchTokens = buildSearchTokens(
    data.name,
    data.slug,
    data.shortDescription,
    ...data.variants.map((variant) => variant.sku),
  );
  const aggregates = computeProductAggregates(
    data.variants.map((variant, index) => ({
      id: variant.id ?? `v${index}`,
      price: variant.price,
      stockQty: variant.stockQty,
      isDefault: variant.isDefault,
    })),
    data.basePrice,
  );

  const variantsSnap = existing.exists ? await ref.collection("variants").get() : null;
  const batch = db.batch();
  batch.set(
    ref,
    {
      name: data.name,
      slug: data.slug || slugify(data.name),
      brandId: data.brandId,
      categoryIds: data.categoryIds,
      shortDescription: data.shortDescription,
      description: data.description,
      images: data.images,
      options: data.options,
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice,
      unit: data.unit,
      status: data.status,
      isNew: data.isNew,
      isBestSeller: data.isBestSeller,
      relatedProductIds: data.relatedProductIds,
      seo: data.seo ?? { title: data.name, description: data.shortDescription },
      searchTokens,
      ...aggregates,
      createdAt: existing.exists ? existing.data()?.createdAt ?? now : now,
      updatedAt: now,
    },
    { merge: true },
  );

  const keep = new Set<string>();
  data.variants.forEach((variant, index) => {
    const id =
      variant.id ||
      slugify(`${Object.values(variant.optionValues).join("-")}-${variant.sku}`) ||
      `v${index}`;
    keep.add(id);
    batch.set(ref.collection("variants").doc(id), {
      sku: variant.sku,
      optionValues: variant.optionValues,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      stockQty: variant.stockQty,
      isDefault: variant.isDefault,
      image: variant.image,
    });
  });
  variantsSnap?.docs.forEach((doc) => {
    if (!keep.has(doc.id)) batch.delete(doc.ref);
  });
  await batch.commit();

  revalidateCatalog();
  await writeAuditLog({
    actor,
    action: existing.exists ? "product.update" : "product.create",
    entity: "products",
    entityId: ref.id,
    meta: { slug: data.slug, status: data.status, key: optionKey(data.variants[0]?.optionValues ?? {}) },
  });
  return { id: ref.id };
}

export async function bulkProductStatusAction(ids: string[], status: "active" | "archived") {
  const actor = await requireAdmin();
  const db = getAdminDb();
  const batch = db.batch();
  ids.forEach((id) => {
    batch.update(db.collection("products").doc(id), {
      status,
      updatedAt: new Date(),
    });
  });
  await batch.commit();
  revalidateCatalog();
  await writeAuditLog({
    actor,
    action: "product.bulkStatus",
    entity: "products",
    entityId: ids.join(","),
    meta: { status, count: ids.length },
  });
}

export async function saveCategoryAction(input: unknown) {
  const actor = await requireAdmin();
  const data = categoryDocumentSchema.extend({ id: z.string().min(1).optional() }).parse(input);
  const db = getAdminDb();
  const ref = data.id
    ? db.collection("categories").doc(data.id)
    : db.collection("categories").doc();
  await ref.set(categoryDocumentSchema.parse(data), { merge: true });
  revalidateCatalog();
  await writeAuditLog({
    actor,
    action: "category.save",
    entity: "categories",
    entityId: ref.id,
  });
  return { id: ref.id };
}

export async function reorderCategoriesAction(ids: string[]) {
  const actor = await requireAdmin();
  const db = getAdminDb();
  const batch = db.batch();
  ids.forEach((id, order) => {
    batch.update(db.collection("categories").doc(id), { order });
  });
  await batch.commit();
  revalidateCatalog();
  await writeAuditLog({
    actor,
    action: "category.reorder",
    entity: "categories",
    entityId: "tree",
  });
}

export async function saveBrandAction(input: unknown) {
  const actor = await requireAdmin();
  const data = brandDocumentSchema.extend({ id: z.string().min(1).optional() }).parse(input);
  const db = getAdminDb();
  const ref = data.id ? db.collection("brands").doc(data.id) : db.collection("brands").doc();
  await ref.set(brandDocumentSchema.parse(data), { merge: true });
  revalidateCatalog();
  await writeAuditLog({
    actor,
    action: "brand.save",
    entity: "brands",
    entityId: ref.id,
  });
  return { id: ref.id };
}

