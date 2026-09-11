import type { Firestore } from "firebase-admin/firestore";
import { loadEnvFile } from "./load-env";
import { discountSchema } from "../types/discount";
import { seedDiscounts } from "./seed-discount-data";

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

async function writeDiscounts(db: Firestore) {
  const snapshot = await db.collection("discounts").listDocuments();
  for (const ref of snapshot) {
    await ref.delete();
  }
  for (const discount of seedDiscounts) {
    discountSchema.parse(discount);
    const { code, ...data } = discount;
    await db.collection("discounts").doc(code).set(data);
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
    console.log(`Seeding discounts into ${PRODUCTION_PROJECT_ID} (catalog is left unchanged)...`);
  }

  const { getAdminDb } = await import("../lib/firebase/admin");
  await writeDiscounts(getAdminDb());
  console.log(
    `Seeded ${seedDiscounts.length} discount codes into ${isProd ? PRODUCTION_PROJECT_ID : "the emulator"}: ${seedDiscounts.map((entry) => entry.code).join(", ")}.`,
  );
}

seed().catch((error) => {
  console.error("Discount seed failed.", error);
  process.exit(1);
});
