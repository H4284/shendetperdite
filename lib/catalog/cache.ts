import { revalidateTag, unstable_cache } from "next/cache";
import {
  fetchBestSellers,
  fetchBrandBySlug,
  fetchBrands,
  fetchCategoryBySlug,
  fetchCategoryTree,
  fetchNewProducts,
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  fetchSaleProducts,
  fetchSearchProducts,
} from "@/lib/catalog/queries";
import {
  applyLiveBrandMedia,
  applyLiveCategoryMedia,
  applyLiveCategoryTree,
  applyLiveProductMedia,
} from "@/lib/catalog/live-media";
import type { ListProductsInput, Product } from "@/types/catalog";

const PRODUCTS_TAG = "products";
const CACHE_VERSION = "live-media-v1";

function productTag(slug: string) {
  return `product:${slug}`;
}

export function revalidateCatalog(tag: string = PRODUCTS_TAG) {
  revalidateTag(tag);
}

export async function getCategoryTree() {
  const tree = await unstable_cache(fetchCategoryTree, [CACHE_VERSION, "catalog-category-tree"], {
    tags: [PRODUCTS_TAG],
  })();
  return applyLiveCategoryTree(tree);
}

export async function getCategoryBySlug(slug: string) {
  const category = await unstable_cache(
    () => fetchCategoryBySlug(slug),
    [CACHE_VERSION, "catalog-category", slug],
    { tags: [PRODUCTS_TAG] },
  )();
  return category ? applyLiveCategoryMedia(category) : null;
}

export async function getBrandBySlug(slug: string) {
  const brand = await unstable_cache(
    () => fetchBrandBySlug(slug),
    [CACHE_VERSION, "catalog-brand", slug],
    { tags: [PRODUCTS_TAG] },
  )();
  return brand ? applyLiveBrandMedia(brand) : null;
}

export async function getProductBySlug(slug: string) {
  const product = await unstable_cache(
    () => fetchProductBySlug(slug),
    [CACHE_VERSION, "catalog-product", slug],
    { tags: [PRODUCTS_TAG, productTag(slug)] },
  )();
  if (!product) return null;
  return { ...applyLiveProductMedia(product), variants: product.variants };
}

export async function listProducts(input: ListProductsInput = {}) {
  const key = JSON.stringify({
    categoryId: input.categoryId ?? null,
    brandId: input.brandId ?? null,
    page: input.page ?? 1,
    pageSize: input.pageSize ?? 12,
    sort: input.sort ?? "newest",
  });

  const listing = await unstable_cache(
    () => fetchProducts(input),
    [CACHE_VERSION, "catalog-list-products", key],
    { tags: [PRODUCTS_TAG] },
  )();

  return {
    ...listing,
    items: listing.items.map(applyLiveProductMedia),
  };
}

export async function searchProducts(q: string) {
  const products = await unstable_cache(
    () => fetchSearchProducts(q),
    [CACHE_VERSION, "catalog-search", q.toLowerCase().trim()],
    { tags: [PRODUCTS_TAG] },
  )();
  return products.map(applyLiveProductMedia);
}

export async function getRelatedProducts(product: Product) {
  const related = await unstable_cache(
    () => fetchRelatedProducts(product),
    [CACHE_VERSION, "catalog-related", product.id],
    { tags: [PRODUCTS_TAG, productTag(product.slug)] },
  )();
  return related.map(applyLiveProductMedia);
}

export async function getBestSellers() {
  const products = await unstable_cache(fetchBestSellers, [CACHE_VERSION, "catalog-best-sellers"], {
    tags: [PRODUCTS_TAG],
  })();
  return products.map(applyLiveProductMedia);
}

export async function getNewProducts() {
  const products = await unstable_cache(fetchNewProducts, [CACHE_VERSION, "catalog-new-products"], {
    tags: [PRODUCTS_TAG],
  })();
  return products.map(applyLiveProductMedia);
}

export async function getBrands() {
  const brands = await unstable_cache(fetchBrands, [CACHE_VERSION, "catalog-brands"], {
    tags: [PRODUCTS_TAG],
  })();
  return brands.map(applyLiveBrandMedia);
}

export async function getSaleProducts() {
  const products = await unstable_cache(fetchSaleProducts, [CACHE_VERSION, "catalog-sale-products"], {
    tags: [PRODUCTS_TAG],
  })();
  return products.map(applyLiveProductMedia);
}
