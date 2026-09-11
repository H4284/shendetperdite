import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { normalizeDiscountCode, validateDiscount } from "@/lib/cart/discount";
import { discountSchema, type Discount } from "@/types/discount";

function toDate(value: unknown): Date | null {
  if (value == null) return null;
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

function parseDiscount(code: string, data: DocumentData): Discount {
  return discountSchema.parse({
    code,
    type: data.type,
    value: data.value,
    minSubtotal: data.minSubtotal ?? 0,
    startsAt: toDate(data.startsAt),
    endsAt: toDate(data.endsAt),
    usageLimit: data.usageLimit ?? null,
    usedCount: data.usedCount ?? 0,
    isActive: data.isActive ?? false,
  });
}

export async function loadDiscount(code: string) {
  const normalized = normalizeDiscountCode(code);
  if (!normalized) return null;
  const snap = await getAdminDb().collection("discounts").doc(normalized).get();
  if (!snap.exists) return null;
  return parseDiscount(snap.id, snap.data() ?? {});
}

export async function evaluateDiscount(code: string, subtotal: number) {
  const discount = await loadDiscount(code);
  return validateDiscount(discount, subtotal);
}
