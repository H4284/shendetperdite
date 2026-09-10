import {
  Timestamp,
  type DocumentData,
  type Firestore,
  type OrderByDirection,
  type Query,
} from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { computeProductAggregates } from "@/lib/catalog/aggregates";
import { tokenizeSearchQuery } from "@/lib/catalog/search-tokens";
import {
  brandSchema,
  categorySchema,
  productSchema,
  variantSchema,
  type Brand,
  type Category,
  type CategoryTreeNode,
  type ListProductsInput,
  type ListProductsResult,
  type Product,
  type ProductSort,
  type ProductWithVariants,
  type Variant,
} from "@/types/catalog";

const DEFAULT_PAGE_SIZE = 12;

function db(): Firestore {
  return getAdminDb();
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: unknown }).toDate === "function"
  ) {
    return (value as Timestamp).toDate();
  }
  throw new Error("Invalid timestamp value");
}

function parseCategory(id: string, data: DocumentData): Category {
  return categorySchema.parse({ id, ...data });
}

function parseBrand(id: string, data: DocumentData): Brand {
  return brandSchema.parse({ id, ...data });
}

function parseProduct(id: string, data: DocumentData): Product {
  return productSchema.parse({
    id,
    ...data,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  });
}

function parseVariant(id: string, data: DocumentData): Variant {
  return variantSchema.parse({ id, ...data });
}

function isIndexError(error: unknown) {
  const err = error as { code?: number | string; message?: string; details?: string };
  const text = `${err.message ?? ""} ${err.details ?? ""}`;
  return (
    err.code === 9 ||
    err.code === "failed-precondition" ||
    text.includes("requires an index")
  );
}

async function fetchActiveProducts(): Promise<Product[]> {
  const snapshot = await db()
    .collection("products")
    .where("status", "==", "active")
    .get();

  return snapshot.docs.map((doc) => parseProduct(doc.id, doc.data()));
}

function sortProducts(items: Product[], sort: ProductSort) {
  return [...items].sort((a, b) => {
    if (sort === "price-asc") return a.minPrice - b.minPrice;
    if (sort === "price-desc") return b.minPrice - a.minPrice;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export async function fetchCategoryTree(): Promise<CategoryTreeNode[]> {
  const snapshot = await db()
    .collection("categories")
    .where("isActive", "==", true)
    .get();

  const categories = snapshot.docs
    .map((doc) => parseCategory(doc.id, doc.data()))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const nodes = new Map<string, CategoryTreeNode>(
    categories.map((category) => [category.id, { ...category, children: [] }]),
  );
  const roots: CategoryTreeNode[] = [];

  for (const node of nodes.values()) {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  for (const node of nodes.values()) {
    node.children.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }

  return roots.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const snapshot = await db()
    .collection("categories")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const category = parseCategory(doc.id, doc.data());
  return category.isActive ? category : null;
}

export async function fetchBrands(): Promise<Brand[]> {
  const snapshot = await db()
    .collection("brands")
    .where("isActive", "==", true)
    .get();

  return snapshot.docs
    .map((doc) => parseBrand(doc.id, doc.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "sq"));
}

export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
  const snapshot = await db()
    .collection("brands")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const brand = parseBrand(doc.id, doc.data());
  return brand.isActive ? brand : null;
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ProductWithVariants | null> {
  const snapshot = await db()
    .collection("products")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) return null;
  if (doc.data().status !== "active") return null;

  const variantsSnap = await doc.ref.collection("variants").get();
  const variants = variantsSnap.docs
    .map((variantDoc) => parseVariant(variantDoc.id, variantDoc.data()))
    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.sku.localeCompare(b.sku));

  return { ...parseProduct(doc.id, doc.data()), variants };
}

function sortField(sort: ProductSort): { field: string; direction: OrderByDirection } {
  if (sort === "price-asc") return { field: "minPrice", direction: "asc" };
  if (sort === "price-desc") return { field: "minPrice", direction: "desc" };
  return { field: "createdAt", direction: "desc" };
}

function paginateProducts(
  items: Product[],
  page: number,
  pageSize: number,
): ListProductsResult {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
  };
}

async function fetchProductsIndexed(
  input: ListProductsInput,
  page: number,
  pageSize: number,
  sort: ProductSort,
): Promise<ListProductsResult> {
  const { field, direction } = sortField(sort);
  let query: Query = db()
    .collection("products")
    .where("status", "==", "active");

  if (input.categoryId) {
    query = query.where("categoryIds", "array-contains", input.categoryId);
  }
  if (input.brandId) {
    query = query.where("brandId", "==", input.brandId);
  }

  query = query.orderBy(field, direction);

  const countSnap = await query.count().get();
  const total = countSnap.data().count;
  const snapshot = await query.offset((page - 1) * pageSize).limit(pageSize).get();

  return {
    items: snapshot.docs.map((doc) => parseProduct(doc.id, doc.data())),
    page,
    pageSize,
    total,
  };
}

async function fetchProductsInMemory(
  input: ListProductsInput,
  page: number,
  pageSize: number,
  sort: ProductSort,
): Promise<ListProductsResult> {
  let items = await fetchActiveProducts();
  if (input.categoryId) {
    items = items.filter((product) => product.categoryIds.includes(input.categoryId!));
  }
  if (input.brandId) {
    items = items.filter((product) => product.brandId === input.brandId);
  }

  return paginateProducts(sortProducts(items, sort), page, pageSize);
}

export async function fetchProducts(
  input: ListProductsInput = {},
): Promise<ListProductsResult> {
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, input.pageSize ?? DEFAULT_PAGE_SIZE));
  const sort = input.sort ?? "newest";

  try {
    return await fetchProductsIndexed(input, page, pageSize, sort);
  } catch (error) {
    if (!isIndexError(error)) throw error;
    return fetchProductsInMemory(input, page, pageSize, sort);
  }
}

export async function fetchSearchProducts(q: string): Promise<Product[]> {
  const token = tokenizeSearchQuery(q);
  if (!token) return [];

  try {
    const snapshot = await db()
      .collection("products")
      .where("status", "==", "active")
      .where("searchTokens", "array-contains", token)
      .limit(24)
      .get();

    return snapshot.docs.map((doc) => parseProduct(doc.id, doc.data()));
  } catch (error) {
    if (!isIndexError(error)) throw error;
    return (await fetchActiveProducts())
      .filter((product) => product.searchTokens.includes(token))
      .slice(0, 24);
  }
}

export async function fetchRelatedProducts(product: Product): Promise<Product[]> {
  if (product.relatedProductIds.length === 0) return [];

  const refs = product.relatedProductIds.map((id) =>
    db().collection("products").doc(id),
  );
  const docs = await db().getAll(...refs);

  return docs
    .filter((doc) => doc.exists)
    .map((doc) => parseProduct(doc.id, doc.data() as DocumentData))
    .filter((item) => item.status === "active" && item.id !== product.id);
}

export async function fetchBestSellers(): Promise<Product[]> {
  try {
    const snapshot = await db()
      .collection("products")
      .where("status", "==", "active")
      .where("isBestSeller", "==", true)
      .orderBy("createdAt", "desc")
      .limit(12)
      .get();

    return snapshot.docs.map((doc) => parseProduct(doc.id, doc.data()));
  } catch (error) {
    if (!isIndexError(error)) throw error;
    return sortProducts(
      (await fetchActiveProducts()).filter((product) => product.isBestSeller),
      "newest",
    ).slice(0, 12);
  }
}

export async function fetchNewProducts(): Promise<Product[]> {
  try {
    const snapshot = await db()
      .collection("products")
      .where("status", "==", "active")
      .where("isNew", "==", true)
      .orderBy("createdAt", "desc")
      .limit(12)
      .get();

    return snapshot.docs.map((doc) => parseProduct(doc.id, doc.data()));
  } catch (error) {
    if (!isIndexError(error)) throw error;
    return sortProducts(
      (await fetchActiveProducts()).filter((product) => product.isNew),
      "newest",
    ).slice(0, 12);
  }
}

export async function fetchSaleProducts(): Promise<Product[]> {
  try {
    const snapshot = await db()
      .collection("products")
      .where("status", "==", "active")
      .orderBy("createdAt", "desc")
      .limit(48)
      .get();

    return snapshot.docs
      .map((doc) => parseProduct(doc.id, doc.data()))
      .filter(
        (product) =>
          product.compareAtPrice != null && product.compareAtPrice > product.minPrice,
      )
      .slice(0, 12);
  } catch (error) {
    if (!isIndexError(error)) throw error;
    return sortProducts(await fetchActiveProducts(), "newest")
      .filter(
        (product) =>
          product.compareAtPrice != null && product.compareAtPrice > product.minPrice,
      )
      .slice(0, 12);
  }
}

export async function fetchActiveCategorySlugs(): Promise<string[]> {
  const snapshot = await db()
    .collection("categories")
    .where("isActive", "==", true)
    .get();
  return snapshot.docs.map((doc) => String(doc.data().slug));
}

export async function fetchActiveBrandSlugs(): Promise<string[]> {
  const snapshot = await db()
    .collection("brands")
    .where("isActive", "==", true)
    .get();
  return snapshot.docs.map((doc) => String(doc.data().slug));
}

export async function fetchActiveProductSlugs(): Promise<string[]> {
  const snapshot = await db()
    .collection("products")
    .where("status", "==", "active")
    .get();
  return snapshot.docs.map((doc) => String(doc.data().slug));
}

export async function recomputeProductAggregates(productId: string) {
  const productRef = db().collection("products").doc(productId);
  const productSnap = await productRef.get();
  if (!productSnap.exists) return;

  const variantsSnap = await productRef.collection("variants").get();
  const variants = variantsSnap.docs.map((doc) => ({
    id: doc.id,
    price: Number(doc.data().price ?? 0),
    stockQty: Number(doc.data().stockQty ?? 0),
    isDefault: Boolean(doc.data().isDefault),
  }));

  const aggregates = computeProductAggregates(
    variants,
    Number(productSnap.data()?.basePrice ?? 0),
  );

  await productRef.update({
    ...aggregates,
    updatedAt: new Date(),
  });
}
