import { CategoriesAdmin } from "@/components/admin/catalog-lists";
import { adminListCategories } from "@/lib/admin/queries";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await adminListCategories();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.categories")}</h1>
      <CategoriesAdmin categories={categories} />
    </div>
  );
}
