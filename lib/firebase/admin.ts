import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId =
  process.env.FIREBASE_PROJECT_ID ??
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
  "demo-shendetperdite";

function usingEmulators() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return false;
  }
  return Boolean(
    process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.FIREBASE_STORAGE_EMULATOR_HOST,
  );
}

function normalizePrivateKey(raw: string) {
  let key = raw.trim().replace(/^\uFEFF/, "");
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  if (key.startsWith("{")) {
    const parsed = JSON.parse(key) as { private_key?: string };
    if (parsed.private_key) key = parsed.private_key;
  }
  key = key.replace(/\\n/g, "\n").trim();
  if (!key.includes("BEGIN ") && key.includes("END PRIVATE KEY")) {
    key = `-----BEGIN PRIVATE KEY-----\n${key}`;
  }
  if (!key.endsWith("\n")) key += "\n";
  return key;
}

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  if (usingEmulators()) {
    return initializeApp({ projectId });
  }

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
    : undefined;

  if (clientEmail && privateKey) {
    const serviceAccount: ServiceAccount = {
      projectId,
      clientEmail,
      privateKey,
    };
    return initializeApp({
      credential: cert(serviceAccount),
      projectId,
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
        `${projectId}.appspot.com`,
    });
  }

  return initializeApp({ projectId });
}

export function getAdminAppInstance() {
  return getAdminApp();
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
