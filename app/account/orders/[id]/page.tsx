"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthUser } from "@/lib/auth/use-user";
import { loadOrder } from "@/lib/account/data";
import { formatEuroAmount } from "@/lib/cart/money";
import { orderStatusLabel } from "@/lib/auth/order-status";
import { t } from "@/lib/i18n/sq";
import { Timestamp } from "firebase/firestore";
import type { StoredOrder } from "@/types/order";

type TimelineItem = { status: string; at?: Date | Timestamp; note?: string };

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, ready } = useAuthUser();
  const [order, setOrder] = useState<
    (StoredOrder & { createdAt: Date | null; timeline: TimelineItem[] }) | null | undefined
  >(undefined);

  useEffect(() => {
    if (!user || !params.id) return;
    loadOrder(user.uid, params.id).then(setOrder);
  }, [user, params.id]);

  if (!ready || order === undefined) {
    return <p className="text-sm text-muted-foreground">{t("account.loading")}</p>;
  }
  if (!order) {
    return <p className="text-sm text-muted-foreground">{t("account.orderMissing")}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{order.orderNumber}</h1>
        <p className="text-muted-foreground">{orderStatusLabel(order.status)}</p>
      </div>
      <ul className="divide-y rounded-2xl border">
        {order.items.map((item) => (
          <li key={item.variantId} className="flex justify-between gap-4 p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {t("checkout.line", { qty: item.qty, price: formatEuroAmount(item.price) })}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-1 text-sm">
        <p>
          {t("cart.subtotal")}: {formatEuroAmount(order.subtotal)}
        </p>
        <p>
          {t("checkout.shippingCost")}: {formatEuroAmount(order.shippingCost)}
        </p>
        <p className="text-base font-semibold">
          {t("checkout.total")}: {formatEuroAmount(order.total)}
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="font-semibold">{t("account.timeline")}</h2>
        <ol className="space-y-2">
          {order.timeline.map((entry, index) => {
            const at =
              entry.at instanceof Timestamp
                ? entry.at.toDate()
                : entry.at instanceof Date
                  ? entry.at
                  : null;
            return (
              <li key={`${entry.status}-${index}`} className="rounded-xl border p-3 text-sm">
                <p className="font-medium">{orderStatusLabel(entry.status)}</p>
                {at ? <p className="text-muted-foreground">{at.toLocaleString("sq-AL")}</p> : null}
                {entry.note ? <p>{entry.note}</p> : null}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
