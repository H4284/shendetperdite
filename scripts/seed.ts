import type { Firestore } from "firebase-admin/firestore";
import { loadEnvFile } from "./load-env";
import {
  brandSchema,
  categorySchema,
  productSchema,
  variantSchema,
} from "../types/catalog";
import { seedBrands, seedCategories, seedProducts } from "./seed-data";

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

async function clearCollection(
  db: Firestore,
  path: string,
  recursive = false,
) {
  const snapshot = await db.collection(path).listDocuments();
  for (const ref of snapshot) {
    if (recursive) {
      await db.recursiveDelete(ref);
    } else {
      await ref.delete();
    }
  }
}

async function seed() {
  if (isProd) {
    const email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
    const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim();
    if (!email || !key) {
      throw new Error(
        "Production seed needs FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in .env.local (from Firebase Console → Project settings → Service accounts → Generate new private key).",
      );
    }
    console.log(`Seeding production Firestore project ${PRODUCTION_PROJECT_ID}...`);
  }

  const { getAdminDb } = await import("../lib/firebase/admin");
  const db = getAdminDb();

  await clearCollection(db, "products", true);
  await clearCollection(db, "categories");
  await clearCollection(db, "brands");

  for (const category of seedCategories) {
    categorySchema.parse(category);
    const { id, ...data } = category;
    await db.collection("categories").doc(id).set(data);
  }

  for (const brand of seedBrands) {
    brandSchema.parse(brand);
    const { id, ...data } = brand;
    await db.collection("brands").doc(id).set(data);
  }

  for (const { product, variants } of seedProducts) {
    productSchema.parse(product);
    const { id, ...data } = product;
    await db.collection("products").doc(id).set(data);

    for (const variant of variants) {
      variantSchema.parse(variant);
      const { id: variantId, ...variantData } = variant;
      await db
        .collection("products")
        .doc(id)
        .collection("variants")
        .doc(variantId)
        .set(variantData);
    }
  }

  const twoAxis = seedProducts.filter(({ product }) => product.options.length === 2);
  console.log(
    `Seeded ${seedCategories.length} categories, ${seedBrands.length} brands, ${seedProducts.length} products (${twoAxis.length} with 2 option axes) into ${isProd ? PRODUCTION_PROJECT_ID : "the emulator"}.`,
  );
}

seed().catch((error) => {
  console.error(
    isProd
      ? "Production seed failed. Check Admin credentials, that Firestore is created in native mode, and that Vercel does not use emulator host env vars."
      : "Seed failed. Is the Firebase emulator running?",
    error,
  );
  process.exit(1);
});
