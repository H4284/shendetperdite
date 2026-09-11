import {
  Timestamp,
  type DocumentData,
  type Firestore,
} from "firebase-admin/firestore";
import { applyLiveProductMedia } from "@/lib/catalog/live-media";
import { variantLabel } from "@/lib/format";
import { productSchema, variantSchema } from "@/types/catalog";
import type { CartClamp, CartItem, CartRequestItem } from "@/types/cart";

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

function parseProduct(id: string, data: DocumentData) {
  return applyLiveProductMedia(
    productSchema.parse({
      id,
      ...data,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    }),
  );
}

function parseVariant(id: string, data: DocumentData) {
  const image =
    typeof data.image === "string" && data.image.includes("placehold.co")
      ? null
      : data.image;
  return variantSchema.parse({ id, ...data, image });
}

export async function validateCartItems(
  db: Firestore,
  requested: CartRequestItem[],
): Promise<{ items: CartItem[]; clamped: CartClamp[] }> {
  const grouped = new Map<string, CartRequestItem>();
  for (const item of requested) {
    const existing = grouped.get(item.variantId);
    grouped.set(item.variantId, {
      ...item,
      qty: (existing?.qty ?? 0) + item.qty,
    });
  }

  const items: CartItem[] = [];
  const clamped: CartClamp[] = [];

  for (const request of grouped.values()) {
    const productSnap = await db.collection("products").doc(request.productId).get();
    if (!productSnap.exists) continue;
    const product = parseProduct(productSnap.id, productSnap.data() ?? {});
    if (product.status !== "active") continue;

    const variantSnap = await productSnap.ref
      .collection("variants")
      .doc(request.variantId)
      .get();
    if (!variantSnap.exists) continue;
    const variant = parseVariant(variantSnap.id, variantSnap.data() ?? {});
    if (variant.stockQty <= 0) continue;

    const qty = Math.min(request.qty, variant.stockQty);
    if (qty !== request.qty) {
      clamped.push({
        variantId: variant.id,
        requested: request.qty,
        qty,
      });
    }

    items.push({
      variantId: variant.id,
      productId: product.id,
      sku: variant.sku,
      name: product.name,
      slug: product.slug,
      variantLabel: variantLabel(variant.optionValues),
      image: variant.image ?? product.images[0]?.url ?? null,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice ?? product.compareAtPrice,
      qty,
      maxQty: variant.stockQty,
    });
  }

  return { items, clamped };
}
