import { deleteApp, initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { afterAll, describe, expect, it } from "vitest";

const app = initializeApp({
  apiKey: "demo-api-key",
  projectId: "demo-shendetperdite",
});
const db = getFirestore(app);

try {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
} catch {
  // Already connected in watch mode.
}

describe("firestore security rules", () => {
  it("does not allow an unauthenticated client to write products", async () => {
    await expect(
      setDoc(doc(db, "products", "rules-hacked"), {
        name: "Hacked",
        status: "active",
      }),
    ).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("allows an unauthenticated client to read an active product", async () => {
    const snapshot = await getDoc(doc(db, "products", "proteinocean-whey-protein"));
    expect(snapshot.exists()).toBe(true);
  });

  it("does not allow an unauthenticated client to read orders", async () => {
    await expect(getDoc(doc(db, "orders", "rules-hacked"))).rejects.toMatchObject({
      code: "permission-denied",
    });
  });

  it("does not allow an unauthenticated client to read another user's profile", async () => {
    await expect(getDoc(doc(db, "users", "someone-else"))).rejects.toMatchObject({
      code: "permission-denied",
    });
  });

  it("does not allow an unauthenticated client to write home content", async () => {
    await expect(
      setDoc(doc(db, "content", "home"), { heroSlides: [] }),
    ).rejects.toMatchObject({
      code: "permission-denied",
    });
  });
});

afterAll(async () => {
  await deleteApp(app);
});
