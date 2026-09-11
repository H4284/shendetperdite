"use client";

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { SavedAddress, UserProfile } from "@/types/account";
import type { StoredOrder } from "@/types/order";
import { savedAddressSchema } from "@/types/account";

function asDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

export async function loadProfile(uid: string): Promise<UserProfile> {
  const { db } = getFirebaseClient();
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.data() ?? {};
  return {
    email: String(data.email ?? ""),
    displayName: String(data.displayName ?? ""),
    phone: String(data.phone ?? ""),
    newsletterOptIn: Boolean(data.newsletterOptIn),
  };
}

export async function saveProfile(uid: string, profile: UserProfile) {
  const { db } = getFirebaseClient();
  await setDoc(
    doc(db, "users", uid),
    {
      displayName: profile.displayName,
      phone: profile.phone,
      newsletterOptIn: profile.newsletterOptIn,
      email: profile.email,
      updatedAt: new Date(),
    },
    { merge: true },
  );
}

export async function loadAddresses(uid: string): Promise<SavedAddress[]> {
  const { db } = getFirebaseClient();
  const snap = await getDocs(collection(db, "users", uid, "addresses"));
  return snap.docs.map((entry) => {
    const parsed = savedAddressSchema.safeParse({
      label: entry.data().label ?? "Shtëpi",
      recipient: entry.data().recipient ?? "",
      line1: entry.data().line1 ?? entry.data().address ?? "",
      city: entry.data().city ?? "Prishtinë",
      postalCode: entry.data().postalCode ?? "",
      phone: entry.data().phone ?? "+383",
      country: "Kosovë",
      isDefault: Boolean(entry.data().isDefault),
    });
    return {
      id: entry.id,
      ...(parsed.success
        ? parsed.data
        : {
            label: "Shtëpi",
            recipient: "",
            line1: "",
            city: "Prishtinë",
            postalCode: "",
            phone: "+383",
            country: "Kosovë" as const,
            isDefault: false,
          }),
    };
  });
}

export async function saveAddress(
  uid: string,
  input: Omit<SavedAddress, "id">,
  id?: string,
) {
  const { db } = getFirebaseClient();
  const col = collection(db, "users", uid, "addresses");
  const payload = { ...input, updatedAt: new Date() };
  const ref = id ? doc(col, id) : await addDoc(col, payload);
  if (id) await updateDoc(ref, payload);
  if (input.isDefault) {
    await setDefaultAddress(uid, id ? id : ref.id);
  }
  return id ? id : ref.id;
}

export async function setDefaultAddress(uid: string, addressId: string) {
  const { db } = getFirebaseClient();
  const snap = await getDocs(collection(db, "users", uid, "addresses"));
  const batch = writeBatch(db);
  snap.docs.forEach((entry) => {
    batch.update(entry.ref, { isDefault: entry.id === addressId });
  });
  await batch.commit();
}

export async function removeAddress(uid: string, addressId: string) {
  const { db } = getFirebaseClient();
  await deleteDoc(doc(db, "users", uid, "addresses", addressId));
}

function parseOrder(id: string, data: Record<string, unknown>): StoredOrder {
  return {
    id,
    orderNumber: String(data.orderNumber ?? ""),
    status: String(data.status ?? "pending"),
    customer: {
      email: String((data.customer as { email?: string } | undefined)?.email ?? ""),
      uid: (data.customer as { uid?: string | null } | undefined)?.uid ?? null,
    },
    shippingAddress: data.shippingAddress as StoredOrder["shippingAddress"],
    billingAddress: data.billingAddress as StoredOrder["billingAddress"],
    items: Array.isArray(data.items) ? (data.items as StoredOrder["items"]) : [],
    subtotal: Number(data.subtotal ?? 0),
    discount: (data.discount as StoredOrder["discount"]) ?? null,
    shippingCost: Number(data.shippingCost ?? 0),
    total: Number(data.total ?? 0),
    paymentMethod: (data.paymentMethod as StoredOrder["paymentMethod"]) ?? {
      id: "",
      name: "",
      type: "",
    },
    shippingMethod: (data.shippingMethod as StoredOrder["shippingMethod"]) ?? {
      id: "",
      name: "",
    },
    newsletterOptIn: Boolean(data.newsletterOptIn),
  };
}

export async function loadOrders(uid: string) {
  const { db } = getFirebaseClient();
  const snap = await getDocs(
    query(
      collection(db, "orders"),
      where("customer.uid", "==", uid),
      orderBy("createdAt", "desc"),
    ),
  );
  return snap.docs.map((entry) => ({
    ...parseOrder(entry.id, entry.data()),
    createdAt: asDate(entry.data().createdAt),
    timeline: Array.isArray(entry.data().timeline) ? entry.data().timeline : [],
  }));
}

export async function loadLastOrder(uid: string) {
  const { db } = getFirebaseClient();
  const snap = await getDocs(
    query(
      collection(db, "orders"),
      where("customer.uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(1),
    ),
  );
  const entry = snap.docs[0];
  if (!entry) return null;
  return {
    ...parseOrder(entry.id, entry.data()),
    createdAt: asDate(entry.data().createdAt),
  };
}

export async function loadOrder(uid: string, orderId: string) {
  const { db } = getFirebaseClient();
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.customer?.uid !== uid) return null;
  return {
    ...parseOrder(snap.id, data),
    createdAt: asDate(data.createdAt),
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
  };
}
