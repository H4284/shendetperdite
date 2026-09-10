import { revalidateTag, unstable_cache } from "next/cache";
import {
  fetchBestSellers,
  fetchBrandBySlug,
  fetchCategoryBySlug,
  fetchCategoryTree,
  fetchNewProducts,
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  fetchSearchProducts,
} from "@/lib/catalog/queries";
import type { ListProductsInput, Product } from "@/types/catalog";

const PRODUCTS_TAG = "products";

function productTag(slug: string) {
  return `product:${slug}`;
}

export function revalidateCatalog(tag: string = PRODUCTS_TAG) {
  revalidateTag(tag);
}

export const getCategoryTree = unstable_cache(
  fetchCategoryTree,
  ["catalog-category-tree"],
  { tags: [PRODUCTS_TAG] },
);

export async function getCategoryBySlug(slug: string) {
  return unstable_cache(
    () => fetchCategoryBySlug(slug),
    ["catalog-category", slug],
    { tags: [PRODUCTS_TAG] },
  )();
}

export async function getBrandBySlug(slug: string) {
  return unstable_cache(
    () => fetchBrandBySlug(slug),
    ["catalog-brand", slug],
    { tags: [PRODUCTS_TAG] },
  )();
}

export async function getProductBySlug(slug: string) {
  return unstable_cache(
    () => fetchProductBySlug(slug),
    ["catalog-product", slug],
    { tags: [PRODUCTS_TAG, productTag(slug)] },
  )();
}

export async function listProducts(input: ListProductsInput = {}) {
  const key = JSON.stringify({
    categoryId: input.categoryId ?? null,
    brandId: input.brandId ?? null,
    page: input.page ?? 1,
    pageSize: input.pageSize ?? 12,
    sort: input.sort ?? "newest",
  });

  return unstable_cache(
    () => fetchProducts(input),
    ["catalog-list-products", key],
    { tags: [PRODUCTS_TAG] },
  )();
}

export async function searchProducts(q: string) {
  return unstable_cache(
    () => fetchSearchProducts(q),
    ["catalog-search", q.toLowerCase().trim()],
    { tags: [PRODUCTS_TAG] },
  )();
}

export async function getRelatedProducts(product: Product) {
  return unstable_cache(
    () => fetchRelatedProducts(product),
    ["catalog-related", product.id],
    { tags: [PRODUCTS_TAG, productTag(product.slug)] },
  )();
}

export const getBestSellers = unstable_cache(
  fetchBestSellers,
  ["catalog-best-sellers"],
  { tags: [PRODUCTS_TAG] },
);

export const getNewProducts = unstable_cache(
  fetchNewProducts,
  ["catalog-new-products"],
  { tags: [PRODUCTS_TAG] },
);
