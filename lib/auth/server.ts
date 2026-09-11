import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/paths";
import { verifySessionCookie } from "@/lib/auth/admin";

export async function getSessionUser() {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    return await verifySessionCookie(cookie);
  } catch {
    return null;
  }
}
