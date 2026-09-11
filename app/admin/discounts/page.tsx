import { DiscountsAdmin } from "@/components/admin/discounts-admin";
import { adminListDiscounts } from "@/lib/admin/queries";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const discounts = await adminListDiscounts();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.discounts")}</h1>
      <DiscountsAdmin discounts={discounts} />
    </div>
  );
}
