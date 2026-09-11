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

  it("does not allow an unauthenticated client to write settings", async () => {
    await expect(
      setDoc(doc(db, "settings", "store"), { freeShippingFrom: 1 }),
    ).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("does not allow an unauthenticated client to write audit logs", async () => {
    await expect(
      setDoc(doc(db, "auditLogs", "hack"), { action: "x" }),
    ).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("does not allow an unauthenticated client to write discounts", async () => {
    await expect(
      setDoc(doc(db, "discounts", "HACK"), { type: "percent", value: 100 }),
    ).rejects.toMatchObject({ code: "permission-denied" });
  });
});

afterAll(async () => {
  await deleteApp(app);
});
