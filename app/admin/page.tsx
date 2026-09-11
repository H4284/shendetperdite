import type { Metadata } from "next";
import Link from "next/link";
import { adminDashboardStats } from "@/lib/admin/queries";
import { formatEuroAmount } from "@/lib/cart/money";
import { orderStatusLabel } from "@/lib/auth/order-status";
import { t } from "@/lib/i18n/sq";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await adminDashboardStats();
  const cards = [
    { label: t("admin.today"), data: stats.today },
    { label: t("admin.week"), data: stats.week },
    { label: t("admin.month"), data: stats.month },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.dashboard")}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <section key={card.label} className="rounded-2xl border p-4">
            <h2 className="text-sm text-muted-foreground">{card.label}</h2>
            <p className="mt-2 text-2xl font-semibold">{card.data.orders}</p>
            <p className="text-sm">{t("admin.revenue")}: {formatEuroAmount(card.data.revenue)}</p>
            <p className="text-sm">{t("admin.avgOrder")}: {formatEuroAmount(card.data.avg)}</p>
          </section>
        ))}
      </div>
      <section className="space-y-3">
        <h2 className="font-semibold">{t("admin.latestOrders")}</h2>
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Klienti</th>
                <th className="p-3">Totali</th>
                <th className="p-3">Statusi</th>
              </tr>
            </thead>
            <tbody>
              {stats.latest.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">
                    <Link className="text-primary hover:underline" href={`/admin/orders/${order.id}`}>
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3">{order.customer.email}</td>
                  <td className="p-3">{formatEuroAmount(order.total)}</td>
                  <td className="p-3">{orderStatusLabel(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">{t("admin.lowStock")}</h2>
        <ul className="divide-y rounded-2xl border">
          {stats.lowStock.map((row) => (
            <li key={row.variantId} className="flex justify-between p-3 text-sm">
              <Link href={`/admin/products/${row.productId}`} className="hover:underline">
                {row.productName} · {row.sku}
              </Link>
              <span>{row.stockQty}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
