import type { Firestore } from "firebase-admin/firestore";
import { normalizePhone, type CheckoutAddress } from "@/lib/checkout/schema";

export async function subscribeNewsletter(db: Firestore, email: string) {
  const normalized = email.trim().toLowerCase();
  const existing = await db
    .collection("newsletter")
    .where("email", "==", normalized)
    .limit(1)
    .get();
  if (existing.empty) {
    await db.collection("newsletter").add({
      email: normalized,
      createdAt: new Date(),
    });
  }
}

export async function saveCustomerAddress(
  db: Firestore,
  uid: string,
  email: string,
  address: CheckoutAddress,
) {
  const now = new Date();
  await db.collection("users").doc(uid).set(
    { email: email.trim().toLowerCase(), updatedAt: now },
    { merge: true },
  );
  await db
    .collection("users")
    .doc(uid)
    .collection("addresses")
    .doc("default")
    .set({
      ...address,
      phone: normalizePhone(address.phone),
      isDefault: true,
      updatedAt: now,
    });
}
