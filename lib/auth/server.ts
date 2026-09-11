import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth/paths";
import { isAdminUser, verifySessionCookie, type AuthUser } from "@/lib/auth/admin";

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

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!isAdminUser(user) || !user) {
    redirect("/");
  }
  return user;
}

export async function getAdminUser() {
  const user = await getSessionUser();
  if (!isAdminUser(user) || !user) return null;
  return user;
}
