"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/lib/auth/use-user";
import { loadLastOrder, loadProfile } from "@/lib/account/data";
import { formatEuroAmount } from "@/lib/cart/money";
import { orderStatusLabel } from "@/lib/auth/order-status";
import { t } from "@/lib/i18n/sq";
import type { UserProfile } from "@/types/account";
import type { StoredOrder } from "@/types/order";

export default function AccountPage() {
  const { user, ready } = useAuthUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [order, setOrder] = useState<(StoredOrder & { createdAt: Date | null }) | null>(null);

  useEffect(() => {
    if (!user) return;
    void Promise.all([loadProfile(user.uid), loadLastOrder(user.uid)]).then(
      ([nextProfile, nextOrder]) => {
        setProfile(nextProfile);
        setOrder(nextOrder);
      },
    );
  }, [user]);

  if (!ready) return <p className="text-sm text-muted-foreground">{t("account.loading")}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t("account.overview")}</h1>
      <section className="rounded-2xl border p-5">
        <h2 className="font-semibold">{profile?.displayName || user?.email}</h2>
        <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
      </section>
      <section className="rounded-2xl border p-5">
        <h2 className="mb-3 font-semibold">{t("account.lastOrder")}</h2>
        {order ? (
          <Link href={`/account/orders/${order.id}`} className="block hover:underline">
            <p className="font-medium">{order.orderNumber}</p>
            <p className="text-sm text-muted-foreground">
              {orderStatusLabel(order.status)} · {formatEuroAmount(order.total)}
            </p>
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">{t("account.noOrders")}</p>
        )}
      </section>
    </div>
  );
}
