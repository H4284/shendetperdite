process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
process.env.FIREBASE_STORAGE_EMULATOR_HOST ||= "127.0.0.1:9199";
process.env.FIREBASE_PROJECT_ID ||= "demo-shendetperdite";

import {
  fetchBestSellers,
  fetchBrandBySlug,
  fetchCategoryBySlug,
  fetchCategoryTree,
  fetchNewProducts,
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  fetchSearchProducts,
} from "../lib/catalog/queries";

function heading(title: string) {
  console.log(`\n=== ${title} ===`);
}

async function main() {
  heading("getCategoryTree");
  const tree = await fetchCategoryTree();
  for (const root of tree) {
    console.log(
      `- ${root.name} (${root.slug}) [${root.children.map((child) => child.name).join(", ") || "no children"}]`,
    );
  }
  console.log(`Top-level categories: ${tree.length}`);
  console.log(
    `Total categories: ${tree.reduce((sum, node) => sum + 1 + node.children.length, 0)}`,
  );

  heading("getCategoryBySlug('fitness')");
  console.log(await fetchCategoryBySlug("fitness"));

  heading("getBrandBySlug('now-foods')");
  console.log(await fetchBrandBySlug("now-foods"));

  heading("getProductBySlug('proteinocean-whey-protein')");
  const whey = await fetchProductBySlug("proteinocean-whey-protein");
  console.log({
    name: whey?.name,
    options: whey?.options,
    variantCount: whey?.variants.length,
    variants: whey?.variants.map((variant) => ({
      sku: variant.sku,
      optionValues: variant.optionValues,
      price: variant.price,
      stockQty: variant.stockQty,
    })),
  });

  heading("listProducts({ categoryId: 'proteina', sort: 'price-asc' })");
  console.log(await fetchProducts({ categoryId: "proteina", sort: "price-asc", pageSize: 10 }));

  heading("listProducts({ brandId: 'proteinocean' })");
  console.log(await fetchProducts({ brandId: "proteinocean", pageSize: 10 }));

  heading('searchProducts("whey")');
  const search = await fetchSearchProducts("whey");
  console.log(search.map((product) => product.name));

  heading("getRelatedProducts(whey)");
  if (whey) {
    console.log((await fetchRelatedProducts(whey)).map((product) => product.name));
  }

  heading("getBestSellers");
  console.log((await fetchBestSellers()).map((product) => product.name));

  heading("getNewProducts");
  console.log((await fetchNewProducts()).map((product) => product.name));
}

main().catch((error) => {
  console.error("verify-catalog failed. Seed the emulator first (`npm run seed`).", error);
  process.exit(1);
});
