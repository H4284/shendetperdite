import Link from "next/link";
import { ProductsTable } from "@/components/admin/products-table";
import { Button } from "@/components/ui/button";
import { adminListBrands, adminListCategories, adminListProducts } from "@/lib/admin/queries";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, brands, categories] = await Promise.all([
    adminListProducts(),
    adminListBrands(),
    adminListCategories(),
  ]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{t("admin.products")}</h1>
        <Button nativeButton={false} render={<Link href="/admin/products/new" />}>
          {t("admin.new")}
        </Button>
      </div>
      <ProductsTable products={products} brands={brands} categories={categories} />
    </div>
  );
}
