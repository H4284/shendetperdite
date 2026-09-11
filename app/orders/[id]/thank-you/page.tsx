import Link from "next/link";
import { notFound } from "next/navigation";
import { PurchaseTracker } from "@/components/checkout/purchase-tracker";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { Button } from "@/components/ui/button";
import { formatEuroAmount } from "@/lib/cart/money";
import { getOrderForThankYou } from "@/lib/checkout/get-order";
import { t } from "@/lib/i18n/sq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faleminderit",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function ThankYouPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;
  const order = await getOrderForThankYou(id, token);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <PurchaseTracker
        orderNumber={order.orderNumber}
        total={order.total}
        items={order.items.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
        }))}
      />
      <h1 className="text-3xl font-semibold tracking-tight">{t("checkout.thankYou")}</h1>
      <p className="text-muted-foreground">
        {t("checkout.thankYouBody", { orderNumber: order.orderNumber })}
      </p>
      <p>{t("checkout.thankYouPayment")}</p>
      <ul className="divide-y rounded-2xl border">
        {order.items.map((item) => (
          <li key={item.variantId} className="flex items-center gap-3 p-4">
            <div className="relative size-14 overflow-hidden rounded-lg bg-muted">
              {item.image ? (
                <CatalogImage src={item.image} alt={item.name} fill sizes="56px" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {t("checkout.line", {
                  qty: item.qty,
                  price: formatEuroAmount(item.price),
                })}
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
          {t("checkout.shippingCost")}:{" "}
          {order.shippingCost === 0
            ? t("checkout.shippingFree")
            : formatEuroAmount(order.shippingCost)}
        </p>
        <p className="text-lg font-semibold">
          {t("checkout.total")}: {formatEuroAmount(order.total)}
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/" />}>
        {t("checkout.backHome")}
      </Button>
    </div>
  );
}
