import type { Brand, Category, Product } from "../lib/types/catalog";

process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= "127.0.0.1:9199";
process.env.FIREBASE_PROJECT_ID ||= "demo-shendetperdite";

const categories: Category[] = [
  {
    id: "vitamina-minerale",
    slug: "vitamina-minerale",
    name: "Vitamina & Minerale",
    parentId: null,
  },
  {
    id: "fitness",
    slug: "fitness",
    name: "Fitness",
    parentId: null,
  },
  {
    id: "shendeti-i-tretjes",
    slug: "shendeti-i-tretjes",
    name: "Shëndeti i tretjes",
    parentId: null,
  },
];

const brands: Brand[] = [
  { id: "now-foods", slug: "now-foods", name: "NOW Foods" },
  { id: "proteinocean", slug: "proteinocean", name: "Proteinocean" },
];

const products: Product[] = [
  {
    id: "now-foods-magnesium-glycinate",
    slug: "now-foods-magnesium-glycinate",
    name: "Now Foods Magnesium Glycinate",
    brandId: "now-foods",
    categoryIds: ["vitamina-minerale"],
    price: 35,
    currency: "EUR",
  },
  {
    id: "nowsports-creatine-monohydrate",
    slug: "nowsports-creatine-monohydrate",
    name: "NowSports Micronized Creatine Monohydrate",
    brandId: "now-foods",
    categoryIds: ["fitness"],
    price: 20,
    currency: "EUR",
  },
  {
    id: "proteinocean-whey-protein",
    slug: "proteinocean-whey-protein",
    name: "Proteinocean Whey Protein",
    brandId: "proteinocean",
    categoryIds: ["fitness"],
    price: 22,
    currency: "EUR",
  },
  {
    id: "proteinocean-l-carnitine",
    slug: "proteinocean-l-carnitine",
    name: "Proteinocean L-Carnitine",
    brandId: "proteinocean",
    categoryIds: ["fitness"],
    price: 15,
    currency: "EUR",
  },
  {
    id: "now-foods-ultra-omega-3",
    slug: "now-foods-ultra-omega-3",
    name: "Now Foods Ultra Omega 3-D Fish Oil",
    brandId: "now-foods",
    categoryIds: ["vitamina-minerale", "shendeti-i-tretjes"],
    price: 31,
    currency: "EUR",
  },
];

async function seed() {
  const { getAdminDb } = await import("../lib/firebase/admin");
  const db = getAdminDb();

  const batch = db.batch();

  for (const category of categories) {
    batch.set(db.collection("categories").doc(category.id), category);
  }
  for (const brand of brands) {
    batch.set(db.collection("brands").doc(brand.id), brand);
  }
  for (const product of products) {
    batch.set(db.collection("products").doc(product.id), product);
  }

  await batch.commit();

  console.log(
    `Seeded ${categories.length} categories, ${brands.length} brands, ${products.length} products.`,
  );
}

seed().catch((error) => {
  console.error("Seed failed. Is the Firebase emulator running?", error);
  process.exit(1);
});
