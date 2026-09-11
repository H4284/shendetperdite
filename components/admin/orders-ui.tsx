"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateOrderStatusAction } from "@/lib/admin/actions-orders";
import { ORDER_STATUSES, orderStatusLabel, type OrderStatus } from "@/lib/auth/order-status";
import { formatEuroAmount } from "@/lib/cart/money";
import { t } from "@/lib/i18n/sq";
import type { StoredOrder } from "@/types/order";

export function OrdersTable({ orders }: { orders: StoredOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        if (status !== "all" && order.status !== status) return false;
        if (query && !`${order.orderNumber} ${order.customer.email}`.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        return true;
      }),
    [orders, query, status],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder={t("admin.search")} value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="h-9 rounded-lg border bg-background px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Të gjitha</option>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>{orderStatusLabel(value)}</option>
          ))}
        </select>
        <Button nativeButton={false} render={<a href="/api/admin/orders.csv" />}>
          {t("admin.exportCsv")}
        </Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Numri</th>
              <th className="p-3">Data</th>
              <th className="p-3">Klienti</th>
              <th className="p-3">Totali</th>
              <th className="p-3">Statusi</th>
              <th className="p-3">Pagesa</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">
                  <Link className="text-primary hover:underline" href={`/admin/orders/${order.id}`}>
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3">{order.createdAt?.toLocaleString("sq-AL") ?? ""}</td>
                <td className="p-3">{order.customer.email}</td>
                <td className="p-3">{formatEuroAmount(order.total)}</td>
                <td className="p-3">{orderStatusLabel(order.status)}</td>
                <td className="p-3">{order.paymentMethod.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrderStatusForm({ order }: { order: StoredOrder }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(next: string) {
    setBusy(true);
    try {
      await updateOrderStatusAction({ id: order.id, status: next as OrderStatus, note });
      toast.success(t("admin.saved"));
      setNote("");
      router.refresh();
    } catch {
      toast.error("Nuk u ndryshua statusi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <label className="block space-y-1.5 text-sm">
        <span>{t("admin.status")}</span>
        <select className="h-9 w-full rounded-lg border bg-background px-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>{orderStatusLabel(value)}</option>
          ))}
        </select>
      </label>
      <Textarea placeholder={t("admin.note")} value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex gap-2">
        <Button type="button" disabled={busy} onClick={() => void submit(status)}>{t("admin.save")}</Button>
        {order.status !== "cancelled" ? (
          <Button type="button" variant="destructive" disabled={busy} onClick={() => void submit("cancelled")}>
            {t("admin.cancelOrder")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
