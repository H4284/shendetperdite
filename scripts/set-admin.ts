import { loadEnvFile } from "./load-env";

loadEnvFile(".env.local");
delete process.env.FIRESTORE_EMULATOR_HOST;
delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS = "false";
process.env.FIREBASE_PROJECT_ID = "shendetperdite-8d758";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "shendetperdite-8d758";

async function lookupUser(email: string) {
  const { getFirebaseProjectId, getGoogleAccessToken } = await import("../lib/firebase/admin");
  const projectId = getFirebaseProjectId();
  const token = await getGoogleAccessToken();
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: [email] }),
    },
  );
  if (!response.ok) {
    throw new Error(`lookup_failed:${response.status} ${await response.text()}`);
  }
  const data = (await response.json()) as { users?: Array<{ localId?: string; email?: string }> };
  const user = data.users?.[0];
  if (!user?.localId) {
    throw new Error(`No Firebase user for ${email}`);
  }
  return user;
}

async function setClaims(localId: string) {
  const { getFirebaseProjectId, getGoogleAccessToken } = await import("../lib/firebase/admin");
  const projectId = getFirebaseProjectId();
  const token = await getGoogleAccessToken();
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        localId,
        customAttributes: JSON.stringify({ admin: true, role: "admin" }),
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`claims_failed:${response.status} ${await response.text()}`);
  }
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run admin:set -- you@example.com");
    process.exit(1);
  }
  const { getAdminAppInstance } = await import("../lib/firebase/admin");
  getAdminAppInstance();
  const user = await lookupUser(email);
  await setClaims(user.localId!);
  console.log(`Granted admin claim to ${email} (${user.localId}). Sign out and sign in again.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
