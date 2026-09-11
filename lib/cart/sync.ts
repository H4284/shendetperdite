"use client";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase/client";
import { mergeCartItems } from "@/lib/cart/merge";
import { useCartStore } from "@/lib/cart/store";
import type { AppliedDiscount, CartItem } from "@/types/cart";

type RemoteCart = {
  items: CartItem[];
  discountCode?: string;
  discount: AppliedDiscount | null;
};

function cartRef(uid: string) {
  const { db } = getFirebaseClient();
  return doc(db, "users", uid, "cart", "state");
}

let currentUid: string | null = null;
let writing = false;

export async function writeCartToAccount() {
  if (!currentUid || writing) return;
  const { items, discountCode, discount } = useCartStore.getState();
  writing = true;
  try {
    await setDoc(
      cartRef(currentUid),
      { items, discountCode: discountCode ?? null, discount, updatedAt: new Date() },
      { merge: true },
    );
  } catch {
    // Guest cart still lives in localStorage; account sync waits for EPIC 6 login.
  } finally {
    writing = false;
  }
}

async function mergeAccountCart(uid: string) {
  const snap = await getDoc(cartRef(uid));
  const remote = snap.exists() ? (snap.data() as RemoteCart) : null;
  const local = useCartStore.getState();
  const items = mergeCartItems(remote?.items ?? [], local.items);
  useCartStore.getState().replaceItems(items);
  if (!local.discount && remote?.discount) {
    useCartStore.getState().setDiscount(remote.discount, remote.discountCode);
  }
  await writeCartToAccount();
}

export function subscribeCartAuth() {
  const { auth } = getFirebaseClient();
  return onAuthStateChanged(auth, async (user) => {
    currentUid = user?.uid ?? null;
    if (!user) return;
    try {
      await mergeAccountCart(user.uid);
    } catch {
      // Keep the local cart if Firestore is unreachable.
    }
  });
}
