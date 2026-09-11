"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/lib/auth/use-user";
import { loadOrders } from "@/lib/account/data";
import { formatEuroAmount } from "@/lib/cart/money";
import { orderStatusLabel } from "@/lib/auth/order-status";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n/sq";
import type { StoredOrder } from "@/types/order";

export default function OrdersPage() {
  const { user, ready } = useAuthUser();
  const [orders, setOrders] = useState<(StoredOrder & { createdAt: Date | null })[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadOrders(user.uid)
      .then(setOrders)
      .catch(() => setError(true));
  }, [user]);

  if (!ready) return <p className="text-sm text-muted-foreground">{t("account.loading")}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t("account.orders")}</h1>
      {error ? <p className="text-sm text-destructive">{t("account.ordersError")}</p> : null}
      {orders.length === 0 && !error ? (
        <p className="text-sm text-muted-foreground">{t("account.noOrders")}</p>
      ) : (
        <ul className="divide-y rounded-2xl border">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.createdAt
                      ? order.createdAt.toLocaleDateString("sq-AL")
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{orderStatusLabel(order.status)}</Badge>
                  <span className="font-medium">{formatEuroAmount(order.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
