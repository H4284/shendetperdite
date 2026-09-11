import type { Firestore } from "firebase-admin/firestore";
import { loadEnvFile } from "./load-env";
import { defaultPaymentMethods, defaultShippingMethods } from "../lib/checkout/defaults";

const PRODUCTION_PROJECT_ID = "shendetperdite-8d758";
const isProd = process.argv.includes("--prod");

loadEnvFile(".env.local");

if (isProd) {
  delete process.env.FIRESTORE_EMULATOR_HOST;
  delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
  delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS = "false";
  process.env.FIREBASE_PROJECT_ID = PRODUCTION_PROJECT_ID;
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = PRODUCTION_PROJECT_ID;
} else {
  process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
  process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= "127.0.0.1:9199";
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS = "true";
  process.env.FIREBASE_PROJECT_ID ||= "demo-shendetperdite";
}

async function writeCheckoutData(db: Firestore) {
  for (const method of defaultShippingMethods) {
    const { id, ...data } = method;
    await db.collection("shippingMethods").doc(id).set(data);
  }
  for (const method of defaultPaymentMethods) {
    const { id, ...data } = method;
    await db.collection("paymentMethods").doc(id).set(data);
  }
  const counterRef = db.collection("counters").doc("orders");
  const counter = await counterRef.get();
  if (!counter.exists) {
    await counterRef.set({
      year: new Date().getUTCFullYear(),
      seq: 0,
      updatedAt: new Date(),
    });
  }
}

async function seed() {
  if (isProd) {
    const email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
    const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim();
    if (!email || !key) {
      throw new Error(
        "Production seed needs FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in .env.local.",
      );
    }
    console.log(
      `Seeding shipping/payment methods into ${PRODUCTION_PROJECT_ID} (catalog is left unchanged)...`,
    );
  }

  const { getAdminDb } = await import("../lib/firebase/admin");
  await writeCheckoutData(getAdminDb());
  console.log(
    `Seeded shipping and payment methods into ${isProd ? PRODUCTION_PROJECT_ID : "the emulator"}.`,
  );
}

seed().catch((error) => {
  console.error("Checkout seed failed.", error);
  process.exit(1);
});
