import { SettingsEditor } from "@/components/admin/settings-editor";
import { getAdminDb } from "@/lib/firebase/admin";
import { getStoreSettings } from "@/lib/settings/store";
import { defaultPaymentMethods, defaultShippingMethods } from "@/lib/checkout/defaults";
import { paymentMethodSchema, shippingMethodSchema } from "@/types/checkout";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const db = getAdminDb();
  const [settings, shippingSnap, paymentSnap] = await Promise.all([
    getStoreSettings(),
    db.collection("shippingMethods").get(),
    db.collection("paymentMethods").get(),
  ]);
  const shipping = shippingSnap.empty
    ? defaultShippingMethods
    : shippingSnap.docs.map((doc) => shippingMethodSchema.parse({ id: doc.id, ...doc.data() }));
  const payments = paymentSnap.empty
    ? defaultPaymentMethods
    : paymentSnap.docs.map((doc) => paymentMethodSchema.parse({ id: doc.id, ...doc.data() }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.settings")}</h1>
      <SettingsEditor settings={settings} shipping={shipping} payments={payments} />
    </div>
  );
}
