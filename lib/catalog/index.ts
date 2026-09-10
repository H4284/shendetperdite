export {
  getBestSellers,
  getBrandBySlug,
  getCategoryBySlug,
  getCategoryTree,
  getNewProducts,
  getProductBySlug,
  getRelatedProducts,
  listProducts,
  revalidateCatalog,
  searchProducts,
} from "@/lib/catalog/cache";

export {
  fetchBestSellers,
  fetchBrandBySlug,
  fetchCategoryBySlug,
  fetchCategoryTree,
  fetchNewProducts,
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  fetchSearchProducts,
  recomputeProductAggregates,
} from "@/lib/catalog/queries";
