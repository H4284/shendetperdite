import { CartPanel } from "@/components/cart/cart-panel";
import { t } from "@/lib/i18n/sq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shporta",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t("cart.pageTitle")}</h1>
      <CartPanel layout="page" />
    </div>
  );
}
