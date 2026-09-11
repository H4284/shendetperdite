import Link from "next/link";
import { adminListOrders, customersFromOrders } from "@/lib/admin/queries";
import { formatEuroAmount } from "@/lib/cart/money";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const orders = await adminListOrders();
  const customers = customersFromOrders(orders);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.customers")}</h1>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Porosi</th>
              <th className="p-3">Totali</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.key} className="border-t">
                <td className="p-3">
                  <Link className="text-primary hover:underline" href={`/admin/customers/${encodeURIComponent(customer.key)}`}>
                    {customer.email}
                  </Link>
                </td>
                <td className="p-3">{customer.orderCount}</td>
                <td className="p-3">{formatEuroAmount(customer.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
