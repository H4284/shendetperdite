"use server";

import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { HOME_TAG } from "@/lib/content/home";
import { SETTINGS_TAG } from "@/lib/settings/store";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  homeContentSchema,
  storeSettingsSchema,
} from "@/types/content";
import { paymentMethodSchema, shippingMethodSchema } from "@/types/checkout";

export async function saveHomeContentAction(input: unknown) {
  const actor = await requireAdmin();
  const data = homeContentSchema.parse(input);
  await getAdminDb().collection("content").doc("home").set(data, { merge: true });
  revalidateTag(HOME_TAG);
  await writeAuditLog({
    actor,
    action: "content.home",
    entity: "content",
    entityId: "home",
  });
}

export async function saveStoreSettingsAction(input: unknown) {
  const actor = await requireAdmin();
  const data = storeSettingsSchema.parse(input);
  const db = getAdminDb();
  await db.collection("settings").doc("store").set(data, { merge: true });
  const shipping = await db.collection("shippingMethods").get();
  const batch = db.batch();
  shipping.docs.forEach((doc) => {
    batch.update(doc.ref, { freeFrom: data.freeShippingFrom });
  });
  if (shipping.empty) {
    batch.set(db.collection("shippingMethods").doc("standard"), {
      name: "Standard",
      description: "1–3 ditë pune",
      price: 2.5,
      freeFrom: data.freeShippingFrom,
      eta: "1–3 ditë pune",
      isActive: true,
    });
  }
  await batch.commit();
  revalidateTag(SETTINGS_TAG);
  await writeAuditLog({
    actor,
    action: "settings.update",
    entity: "settings",
    entityId: "store",
    meta: { freeShippingFrom: data.freeShippingFrom },
  });
}

export async function saveShippingMethodAction(input: unknown) {
  const actor = await requireAdmin();
  const data = shippingMethodSchema.parse(input);
  const { id, ...doc } = data;
  await getAdminDb().collection("shippingMethods").doc(id).set(doc, { merge: true });
  revalidateTag(SETTINGS_TAG);
  await writeAuditLog({
    actor,
    action: "shipping.save",
    entity: "shippingMethods",
    entityId: id,
  });
}

export async function savePaymentMethodAction(input: unknown) {
  const actor = await requireAdmin();
  const data = paymentMethodSchema.parse(input);
  const { id, ...doc } = data;
  await getAdminDb().collection("paymentMethods").doc(id).set(doc, { merge: true });
  revalidateTag(SETTINGS_TAG);
  await writeAuditLog({
    actor,
    action: "payment.save",
    entity: "paymentMethods",
    entityId: id,
  });
}
