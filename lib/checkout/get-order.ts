import { type DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyOrderToken } from "@/lib/checkout/token";
import type { StoredOrder } from "@/types/order";

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
  };
}

export async function getOrderForThankYou(id: string, token: string | undefined) {
  if (!verifyOrderToken(id, token)) return null;
  const snap = await getAdminDb().collection("orders").doc(id).get();
  if (!snap.exists) return null;
  return asOrder(id, snap.data() ?? {});
}
