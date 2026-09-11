import Link from "next/link";
import { adminListOrders, customersFromOrders } from "@/lib/admin/queries";
import { getAdminDb } from "@/lib/firebase/admin";
import { formatEuroAmount } from "@/lib/cart/money";
import { orderStatusLabel } from "@/lib/auth/order-status";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const key = decodeURIComponent(id);
  const orders = await adminListOrders();
  const customer = customersFromOrders(orders).find((entry) => entry.key === key);
  const theirs = orders.filter(
    (order) => order.customer.uid === key || order.customer.email === key,
  );
  const uid = customer?.uid;
  const addresses = uid
    ? (await getAdminDb().collection("users").doc(uid).collection("addresses").get()).docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            recipient: String(data.recipient ?? ""),
            line1: String(data.line1 ?? ""),
            city: String(data.city ?? ""),
          };
        },
      )
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{customer?.email ?? key}</h1>
      <p className="text-sm text-muted-foreground">
        {theirs.length} porosi · {formatEuroAmount(customer?.totalSpent ?? 0)}
      </p>
      <ul className="divide-y rounded-2xl border">
        {theirs.map((order) => (
          <li key={order.id} className="flex justify-between p-3 text-sm">
            <Link className="text-primary hover:underline" href={`/admin/orders/${order.id}`}>
              {order.orderNumber}
            </Link>
            <span>
              {orderStatusLabel(order.status)} · {formatEuroAmount(order.total)}
            </span>
          </li>
        ))}
      </ul>
      <section className="space-y-2">
        <h2 className="font-semibold">Adresat</h2>
        <ul className="space-y-2 text-sm">
          {addresses.map((address) => (
            <li key={address.id} className="rounded-xl border p-3">
              {String(address.recipient ?? "")}, {String(address.line1 ?? "")}, {String(address.city ?? "")}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
