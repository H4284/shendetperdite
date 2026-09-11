import { BrandsAdmin } from "@/components/admin/catalog-lists";
import { adminListBrands } from "@/lib/admin/queries";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await adminListBrands();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.brands")}</h1>
      <BrandsAdmin brands={brands} />
    </div>
  );
}
