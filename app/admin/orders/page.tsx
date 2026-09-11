import { OrdersTable } from "@/components/admin/orders-ui";
import { adminListOrders } from "@/lib/admin/queries";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await adminListOrders();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.orders")}</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
