import { getAdminAppInstance } from "@/lib/firebase/admin";

export async function getAdminAuth() {
  const app = getAdminAppInstance();
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(app);
}

export async function verifyIdToken(idToken: string) {
  const auth = await getAdminAuth();
  return auth.verifyIdToken(idToken);
}

export async function createSessionCookie(idToken: string, expiresIn: number) {
  const auth = await getAdminAuth();
  return auth.createSessionCookie(idToken, { expiresIn });
}

export async function verifySessionCookie(cookie: string) {
  const auth = await getAdminAuth();
  return auth.verifySessionCookie(cookie, true);
}

export async function verifyAppCheckToken(token: string | null) {
  if (process.env.FIREBASE_APP_CHECK_ENFORCE !== "true") return;
  if (!token) {
    throw new Error("app_check_missing");
  }
  const { getAppCheck } = await import("firebase-admin/app-check");
  await getAppCheck(getAdminAppInstance()).verifyToken(token);
}
