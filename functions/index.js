const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");

// Recomputes denormalized product aggregates when a variant changes.

if (getApps().length === 0) {
  initializeApp();
}

function computeProductAggregates(variants, fallbackPrice = 0) {
  if (!variants.length) {
    return {
      minPrice: fallbackPrice,
      maxPrice: fallbackPrice,
      totalStock: 0,
      defaultVariantId: null,
    };
  }

  const prices = variants.map((variant) => variant.price);
  const defaultVariant =
    variants.find((variant) => variant.isDefault) ?? variants[0];

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    totalStock: variants.reduce((sum, variant) => sum + variant.stockQty, 0),
    defaultVariantId: defaultVariant.id,
  };
}

exports.onVariantWrite = onDocumentWritten(
  {
    document: "products/{productId}/variants/{variantId}",
    region: "europe-west1",
  },
  async (event) => {
    const productId = event.params.productId;
    const db = getFirestore();
    const productRef = db.collection("products").doc(productId);
    const productSnap = await productRef.get();
    if (!productSnap.exists) return;

    const variantsSnap = await productRef.collection("variants").get();
    const variants = variantsSnap.docs.map((doc) => ({
      id: doc.id,
      price: Number(doc.data().price ?? 0),
      stockQty: Number(doc.data().stockQty ?? 0),
      isDefault: Boolean(doc.data().isDefault),
    }));

    const aggregates = computeProductAggregates(
      variants,
      Number(productSnap.data()?.basePrice ?? 0),
    );

    await productRef.update({
      ...aggregates,
      updatedAt: new Date(),
    });
  },
);
