import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export async function ensureUserDocument(input: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
}) {
  const ref = getAdminDb().collection("users").doc(input.uid);
  const snap = await ref.get();
  const email = input.email?.trim().toLowerCase() ?? "";
  const displayName = input.displayName?.trim() ?? "";
  const now = FieldValue.serverTimestamp();

  if (!snap.exists) {
    await ref.set({
      email,
      displayName,
      phone: "",
      newsletterOptIn: false,
      createdAt: now,
      updatedAt: now,
    });
    return;
  }

  await ref.set(
    {
      email: email || snap.data()?.email || "",
      updatedAt: now,
    },
    { merge: true },
  );
}
