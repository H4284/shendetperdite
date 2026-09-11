import { getAdminAppInstance } from "@/lib/firebase/admin";

export async function attachCustomerAccount(email: string) {
  try {
    const { getAuth } = await import("firebase-admin/auth");
    const auth = getAuth(getAdminAppInstance());
    const normalized = email.trim().toLowerCase();
    try {
      const existing = await auth.getUserByEmail(normalized);
      return { uid: existing.uid, created: false };
    } catch {
      const created = await auth.createUser({ email: normalized });
      try {
        await auth.generatePasswordResetLink(normalized);
      } catch (error) {
        console.warn("Password setup link was not sent", error);
      }
      return { uid: created.uid, created: true };
    }
  } catch (error) {
    console.warn("Could not create or look up a Firebase Auth user", error);
    return { uid: null, created: false };
  }
}

export async function uidFromAuthorization(header: string | null) {
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    const { getAuth } = await import("firebase-admin/auth");
    const decoded = await getAuth(getAdminAppInstance()).verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}
