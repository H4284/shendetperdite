import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/orders-ui";
import { adminGetOrder } from "@/lib/admin/queries";
import { orderStatusLabel } from "@/lib/auth/order-status";
import { formatEuroAmount } from "@/lib/cart/money";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await adminGetOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="text-muted-foreground">{orderStatusLabel(order.status)}</p>
        </div>
        <Link className="text-sm text-primary hover:underline" href={`/admin/orders/${order.id}/invoice`}>
          {t("admin.invoice")}
        </Link>
      </div>
      <ul className="divide-y rounded-2xl border">
        {order.items.map((item) => (
          <li key={item.variantId} className="flex justify-between p-3 text-sm">
            <span>
              {item.qty} × {item.name}
              {item.variantLabel ? ` — ${item.variantLabel}` : ""}
            </span>
            <span>{formatEuroAmount(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="font-semibold">Totali: {formatEuroAmount(order.total)}</p>
      <section className="grid gap-4 md:grid-cols-2">
        <address className="not-italic rounded-2xl border p-4 text-sm">
          <p className="font-semibold">Dërgesa</p>
          <p>{order.shippingAddress?.recipient}</p>
          <p>{order.shippingAddress?.line1}</p>
          <p>
            {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
          </p>
          <p>{order.shippingAddress?.phone}</p>
          <p>{order.customer.email}</p>
        </address>
        <div className="rounded-2xl border p-4 text-sm">
          <p className="font-semibold">{t("account.timeline")}</p>
          <ol className="mt-2 space-y-2">
            {(order.timeline ?? []).map((entry, index) => (
              <li key={`${entry.status}-${index}`}>
                <p>{orderStatusLabel(entry.status)}</p>
                {entry.at ? <p className="text-muted-foreground">{entry.at.toLocaleString("sq-AL")}</p> : null}
                {entry.note ? <p>{entry.note}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <OrderStatusForm order={order} />
    </div>
  );
}
