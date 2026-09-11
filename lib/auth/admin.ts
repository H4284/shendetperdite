import { getAdminAppInstance } from "@/lib/firebase/admin";

export type AuthUser = {
  uid: string;
  email?: string;
  name?: string;
  admin?: boolean;
  role?: string;
};

export function isAdminUser(user: AuthUser | null | undefined) {
  return Boolean(user && (user.admin === true || user.role === "admin"));
}

type AccessTokenCredential = {
  getAccessToken: () => Promise<{ access_token: string }>;
};

function projectId() {
  return (
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    ""
  );
}

async function getAccessToken() {
  const credential = getAdminAppInstance().options.credential as
    | AccessTokenCredential
    | undefined;
  if (!credential?.getAccessToken) {
    throw new Error("missing_admin_credential");
  }
  const token = await credential.getAccessToken();
  if (!token.access_token) {
    throw new Error("missing_access_token");
  }
  return token.access_token;
}

export async function verifyIdToken(idToken: string): Promise<AuthUser> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("missing_api_key");
  }
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  if (!response.ok) {
    throw new Error("invalid_id_token");
  }
  const data = (await response.json()) as {
    users?: Array<{ localId?: string; email?: string; displayName?: string }>;
  };
  const user = data.users?.[0];
  if (!user?.localId) {
    throw new Error("invalid_id_token");
  }
  return {
    uid: user.localId,
    email: user.email,
    name: user.displayName,
  };
}

export async function createSessionCookie(idToken: string, expiresIn: number) {
  const validDuration = Math.min(
    14 * 24 * 60 * 60,
    Math.max(5 * 60, Math.floor(expiresIn / 1000)),
  );
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId()}:createSessionCookie`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        validDuration: String(validDuration),
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`create_session_cookie_failed:${response.status}`);
  }
  const data = (await response.json()) as { sessionCookie?: string };
  if (!data.sessionCookie) {
    throw new Error("create_session_cookie_failed");
  }
  return data.sessionCookie;
}

export async function verifySessionCookie(cookie: string): Promise<AuthUser> {
  const { decodeProtectedHeader, importX509, jwtVerify } = await import("jose");
  const header = decodeProtectedHeader(cookie);
  if (!header.kid) {
    throw new Error("session_missing_kid");
  }
  const certsResponse = await fetch(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys",
  );
  if (!certsResponse.ok) {
    throw new Error("session_certs_failed");
  }
  const certs = (await certsResponse.json()) as Record<string, string>;
  const pem = certs[header.kid];
  if (!pem) {
    throw new Error("session_unknown_kid");
  }
  const key = await importX509(pem, "RS256");
  const id = projectId();
  const { payload } = await jwtVerify(cookie, key, {
    algorithms: ["RS256"],
    audience: id,
    issuer: `https://session.firebase.google.com/${id}`,
  });
  const uid = String(payload.sub ?? "");
  if (!uid) {
    throw new Error("session_missing_uid");
  }
  return {
    uid,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
    admin: payload.admin === true,
    role: typeof payload.role === "string" ? payload.role : undefined,
  };
}

export async function verifyAppCheckToken(token: string | null) {
  if (process.env.FIREBASE_APP_CHECK_ENFORCE !== "true") return;
  if (!token) {
    throw new Error("app_check_missing");
  }
  const { getAppCheck } = await import("firebase-admin/app-check");
  await getAppCheck(getAdminAppInstance()).verifyToken(token);
}
