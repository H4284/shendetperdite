import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  brandSchema,
  categorySchema,
  productSchema,
  variantSchema,
  type Brand,
  type Category,
  type Product,
  type ProductWithVariants,
  type Variant,
} from "@/types/catalog";
import { discountSchema, type Discount } from "@/types/discount";
import type { StoredOrder } from "@/types/order";

function toDate(value: unknown): Date | null {
  if (!value) return null;
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
  return null;
}

function asOrder(id: string, data: DocumentData): StoredOrder {
  return {
    id,
    orderNumber: String(data.orderNumber ?? ""),
    status: String(data.status ?? "pending"),
    customer: {
      email: String(data.customer?.email ?? ""),
      uid: data.customer?.uid ?? null,
    },
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: Number(data.subtotal ?? 0),
    discount: data.discount ?? null,
    shippingCost: Number(data.shippingCost ?? 0),
    total: Number(data.total ?? 0),
    paymentMethod: data.paymentMethod ?? { id: "", name: "", type: "" },
    shippingMethod: data.shippingMethod ?? { id: "", name: "" },
    newsletterOptIn: Boolean(data.newsletterOptIn),
    createdAt: toDate(data.createdAt),
    timeline: Array.isArray(data.timeline)
      ? data.timeline.map((entry: DocumentData) => ({
          status: String(entry.status ?? ""),
          at: toDate(entry.at),
          note: entry.note ? String(entry.note) : undefined,
        }))
      : [],
  };
}

export async function adminListCategories(): Promise<Category[]> {
  const snap = await getAdminDb().collection("categories").get();
  return snap.docs
    .map((doc) => categorySchema.parse({ id: doc.id, ...doc.data() }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export async function adminListBrands(): Promise<Brand[]> {
  const snap = await getAdminDb().collection("brands").get();
  return snap.docs
    .map((doc) => brandSchema.parse({ id: doc.id, ...doc.data() }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function adminListProducts(): Promise<Product[]> {
  const snap = await getAdminDb().collection("products").get();
  return snap.docs
    .map((doc) => {
      const data = doc.data();
      return productSchema.parse({
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt) ?? new Date(0),
        updatedAt: toDate(data.updatedAt) ?? new Date(0),
      });
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function adminGetProduct(id: string): Promise<ProductWithVariants | null> {
  const ref = getAdminDb().collection("products").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const data = snap.data() ?? {};
  const product = productSchema.parse({
    id: snap.id,
    ...data,
    createdAt: toDate(data.createdAt) ?? new Date(0),
    updatedAt: toDate(data.updatedAt) ?? new Date(0),
  });
  const variantsSnap = await ref.collection("variants").get();
  const variants = variantsSnap.docs.map((doc) =>
    variantSchema.parse({ id: doc.id, ...doc.data() }),
  );
  return { ...product, variants };
}

export async function adminListOrders(): Promise<StoredOrder[]> {
  const snap = await getAdminDb().collection("orders").orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) => asOrder(doc.id, doc.data()));
}

export async function adminGetOrder(id: string): Promise<StoredOrder | null> {
  const snap = await getAdminDb().collection("orders").doc(id).get();
  if (!snap.exists) return null;
  return asOrder(snap.id, snap.data() ?? {});
}

export async function adminListDiscounts(): Promise<Discount[]> {
  const snap = await getAdminDb().collection("discounts").get();
  return snap.docs.map((doc) => {
    const data = doc.data();
    return discountSchema.parse({
      code: doc.id,
      ...data,
      startsAt: toDate(data.startsAt),
      endsAt: toDate(data.endsAt),
    });
  });
}

export async function adminLowStock(limit = 20) {
  const products = await adminListProducts();
  const rows: Array<{
    productId: string;
    productName: string;
    variantId: string;
    sku: string;
    stockQty: number;
  }> = [];
  for (const product of products) {
    const variants = await getAdminDb()
      .collection("products")
      .doc(product.id)
      .collection("variants")
      .get();
    for (const doc of variants.docs) {
      const stockQty = Number(doc.data().stockQty ?? 0);
      if (stockQty <= 5) {
        rows.push({
          productId: product.id,
          productName: product.name,
          variantId: doc.id,
          sku: String(doc.data().sku ?? doc.id),
          stockQty,
        });
      }
    }
  }
  return rows.sort((a, b) => a.stockQty - b.stockQty).slice(0, limit);
}

export type AdminCustomer = {
  key: string;
  email: string;
  uid: string | null;
  orderCount: number;
  totalSpent: number;
};

export function customersFromOrders(orders: StoredOrder[]): AdminCustomer[] {
  const map = new Map<string, AdminCustomer>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const key = order.customer.uid || order.customer.email;
    if (!key) continue;
    const current = map.get(key) ?? {
      key,
      email: order.customer.email,
      uid: order.customer.uid,
      orderCount: 0,
      totalSpent: 0,
    };
    current.orderCount += 1;
    current.totalSpent += order.total;
    map.set(key, current);
  }
  return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}

export async function adminDashboardStats() {
  const orders = await adminListOrders();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  function windowStats(ms: number) {
    const slice = orders.filter((order) => {
      if (order.status === "cancelled") return false;
      const at = order.createdAt?.getTime() ?? 0;
      return now - at <= ms;
    });
    const revenue = slice.reduce((sum, order) => sum + order.total, 0);
    return {
      orders: slice.length,
      revenue,
      avg: slice.length ? revenue / slice.length : 0,
    };
  }
  return {
    today: windowStats(day),
    week: windowStats(7 * day),
    month: windowStats(30 * day),
    latest: orders.slice(0, 10),
    lowStock: await adminLowStock(),
  };
}

export async function adminNewsletterEmails() {
  const snap = await getAdminDb().collection("newsletter").get();
  return snap.docs
    .map((doc) => String(doc.data().email ?? ""))
    .filter(Boolean);
}

export type { Variant };
