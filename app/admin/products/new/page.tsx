import { ProductForm } from "@/components/admin/product-form";
import { adminListBrands, adminListCategories, adminListProducts } from "@/lib/admin/queries";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [brands, categories, products] = await Promise.all([
    adminListBrands(),
    adminListCategories(),
    adminListProducts(),
  ]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.new")}</h1>
      <ProductForm
        brands={brands}
        categories={categories}
        related={products.map((product) => ({ id: product.id, name: product.name }))}
      />
    </div>
  );
}
