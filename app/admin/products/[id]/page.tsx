import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { adminGetProduct, adminListBrands, adminListCategories, adminListProducts } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brands, categories, products] = await Promise.all([
    adminGetProduct(id),
    adminListBrands(),
    adminListCategories(),
    adminListProducts(),
  ]);
  if (!product) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
      <ProductForm
        product={product}
        brands={brands}
        categories={categories}
        related={products
          .filter((entry) => entry.id !== product.id)
          .map((entry) => ({ id: entry.id, name: entry.name }))}
      />
    </div>
  );
}
