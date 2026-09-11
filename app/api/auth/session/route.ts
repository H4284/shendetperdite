import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";
import {
  createSessionCookie,
  verifyAppCheckToken,
  verifyIdToken,
} from "@/lib/auth/admin";
import { ensureUserDocument } from "@/lib/auth/ensure-user";
import { SESSION_COOKIE, SESSION_EXPIRES_MS, SESSION_MAX_AGE } from "@/lib/auth/paths";

export const runtime = "nodejs";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function POST(request: Request) {
  const limited = rateLimit(`auth-session:${clientIp(request)}`);
  if (!limited.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    await verifyAppCheckToken(request.headers.get("X-Firebase-AppCheck"));
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: "missing_token" }, { status: 400 });
    }
    const decoded = await verifyIdToken(idToken);
    await ensureUserDocument({
      uid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name,
    });
    const session = await createSessionCookie(idToken, SESSION_EXPIRES_MS);
    const response = NextResponse.json({ ok: true, uid: decoded.uid });
    response.cookies.set(SESSION_COOKIE, session, cookieOptions());
    return response;
  } catch (error) {
    console.error("POST /api/auth/session failed", error);
    return NextResponse.json({ error: "session_failed" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
