process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
process.env.FIREBASE_PROJECT_ID ||= "demo-shendetperdite";

async function main() {
  const { getAdminDb } = await import("../lib/firebase/admin");
  const db = getAdminDb();
  const productRef = db.collection("products").doc("proteinocean-whey-protein");
  const variantRef = productRef.collection("variants").doc("whey-cookie-400");

  const before = (await productRef.get()).data()?.totalStock as number;
  const previousQty = (await variantRef.get()).data()?.stockQty as number;
  const nextQty = previousQty + 5;

  await variantRef.update({ stockQty: nextQty });

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const after = (await productRef.get()).data()?.totalStock as number;
    if (after === before + 5) {
      console.log(
        `totalStock updated ${before} → ${after} within ${attempt * 500}ms`,
      );
      return;
    }
  }

  throw new Error("totalStock did not update within 5s");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
