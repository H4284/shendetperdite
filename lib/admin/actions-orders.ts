"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/auth/order-status";
import { getAdminDb } from "@/lib/firebase/admin";
import { sendOrderStatusEmail } from "@/lib/checkout/status-email";
import { revalidateCatalog } from "@/lib/catalog/cache";
import { adminGetOrder } from "@/lib/admin/queries";

const FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

function canTransition(from: string, to: OrderStatus) {
  if (to === "cancelled") return from !== "cancelled" && from !== "delivered";
  const fromIndex = FLOW.indexOf(from as OrderStatus);
  const toIndex = FLOW.indexOf(to);
  if (fromIndex < 0 || toIndex < 0) return false;
  return toIndex === fromIndex + 1 || to === from;
}

export async function updateOrderStatusAction(input: {
  id: string;
  status: OrderStatus;
  note?: string;
}) {
  const actor = await requireAdmin();
  if (!ORDER_STATUSES.includes(input.status)) {
    throw new Error("invalid_status");
  }
  const db = getAdminDb();
  const ref = db.collection("orders").doc(input.id);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("order_missing");
    const current = String(snap.data()?.status ?? "pending");
    if (!canTransition(current, input.status)) {
      throw new Error("invalid_transition");
    }
    if (current === input.status && !input.note) return;

    if (input.status === "cancelled" && current !== "cancelled") {
      const items = Array.isArray(snap.data()?.items) ? snap.data()?.items : [];
      for (const item of items) {
        const variantRef = db
          .collection("products")
          .doc(String(item.productId))
          .collection("variants")
          .doc(String(item.variantId));
        const variantSnap = await tx.get(variantRef);
        if (variantSnap.exists) {
          tx.update(variantRef, { stockQty: FieldValue.increment(Number(item.qty ?? 0)) });
        }
      }
    }

    tx.update(ref, {
      status: input.status,
      timeline: FieldValue.arrayUnion({
        status: input.status,
        at: new Date(),
        note: input.note?.trim() || "",
        actor: actor.email ?? actor.uid,
      }),
    });
  });

  const order = await adminGetOrder(input.id);
  if (order) {
    await sendOrderStatusEmail(order, input.status, input.note);
  }
  revalidateCatalog();
  await writeAuditLog({
    actor,
    action: "order.status",
    entity: "orders",
    entityId: input.id,
    meta: { status: input.status, note: input.note ?? "" },
  });
}

export async function saveDiscountAction(input: {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number;
  minSubtotal: number;
  usageLimit: number | null;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}) {
  const actor = await requireAdmin();
  const code = input.code.trim().toUpperCase();
  const db = getAdminDb();
  const ref = db.collection("discounts").doc(code);
  const existing = await ref.get();
  await ref.set(
    {
      type: input.type,
      value: input.value,
      minSubtotal: input.minSubtotal,
      usageLimit: input.usageLimit,
      usedCount: existing.exists ? Number(existing.data()?.usedCount ?? 0) : 0,
      isActive: input.isActive,
      startsAt: input.startsAt ? new Date(input.startsAt) : null,
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
    },
    { merge: true },
  );
  await writeAuditLog({
    actor,
    action: existing.exists ? "discount.update" : "discount.create",
    entity: "discounts",
    entityId: code,
  });
  revalidateTag("discounts");
  return { code };
}

export async function deleteDiscountAction(code: string) {
  const actor = await requireAdmin();
  await getAdminDb().collection("discounts").doc(code.trim().toUpperCase()).delete();
  await writeAuditLog({
    actor,
    action: "discount.delete",
    entity: "discounts",
    entityId: code,
  });
}
