import { notFound } from "next/navigation";
import { adminGetOrder } from "@/lib/admin/queries";
import { getStoreSettings } from "@/lib/settings/store";
import { formatEuroAmount } from "@/lib/cart/money";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, settings] = await Promise.all([adminGetOrder(id), getStoreSettings()]);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6 bg-white p-8 text-black print:max-w-none">
      <style>{`@media print { header, aside, a { display: none !important; } }`}</style>
      <div>
        <h1 className="text-2xl font-semibold">{settings.company.name}</h1>
        <p>{settings.company.address}</p>
        <p>{settings.company.email} · {settings.company.phone}</p>
      </div>
      <h2 className="text-xl font-semibold">Fatura {order.orderNumber}</h2>
      <p>{order.customer.email}</p>
      <p>
        {order.shippingAddress?.recipient}, {order.shippingAddress?.line1}, {order.shippingAddress?.city}
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Artikulli</th>
            <th>Sasia</th>
            <th>Çmimi</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.variantId} className="border-b">
              <td className="py-2">{item.name} {item.variantLabel}</td>
              <td>{item.qty}</td>
              <td>{formatEuroAmount(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-lg font-semibold">Totali: {formatEuroAmount(order.total)}</p>
    </div>
  );
}
