"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { savePaymentMethodAction, saveShippingMethodAction, saveStoreSettingsAction } from "@/lib/admin/actions-content";
import { t } from "@/lib/i18n/sq";
import type { PaymentMethod, ShippingMethod } from "@/types/checkout";
import type { StoreSettings } from "@/types/content";

export function SettingsEditor({
  settings,
  shipping,
  payments,
}: {
  settings: StoreSettings;
  shipping: ShippingMethod[];
  payments: PaymentMethod[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(settings);
  const [methods, setMethods] = useState(shipping);
  const [pays, setPays] = useState(payments);

  return (
    <div className="space-y-8">
      <form
        className="grid gap-3 rounded-2xl border p-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          await saveStoreSettingsAction(draft);
          toast.success(t("admin.saved"));
          router.refresh();
        }}
      >
        <Input
          type="number"
          value={draft.freeShippingFrom}
          onChange={(e) => setDraft({ ...draft, freeShippingFrom: Number(e.target.value) })}
        />
        <Input value={draft.company.name} onChange={(e) => setDraft({ ...draft, company: { ...draft.company, name: e.target.value } })} />
        <Input value={draft.company.email} onChange={(e) => setDraft({ ...draft, company: { ...draft.company, email: e.target.value } })} />
        <Input value={draft.company.phone} onChange={(e) => setDraft({ ...draft, company: { ...draft.company, phone: e.target.value } })} />
        <Input className="md:col-span-2" value={draft.company.address} onChange={(e) => setDraft({ ...draft, company: { ...draft.company, address: e.target.value } })} />
        <Button type="submit">{t("admin.save")}</Button>
      </form>

      <section className="space-y-3">
        <h2 className="font-semibold">Transporti</h2>
        {methods.map((method, index) => (
          <div key={method.id} className="grid gap-2 rounded-xl border p-3 md:grid-cols-4">
            <Input value={method.name} onChange={(e) => updateShip(index, { name: e.target.value })} />
            <Input type="number" value={method.price} onChange={(e) => updateShip(index, { price: Number(e.target.value) })} />
            <Input type="number" value={method.freeFrom ?? 0} onChange={(e) => updateShip(index, { freeFrom: Number(e.target.value) })} />
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={method.isActive} onCheckedChange={(value) => updateShip(index, { isActive: value === true })} />
              Aktiv
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await saveShippingMethodAction(methods[index]);
                toast.success(t("admin.saved"));
              }}
            >
              Ruaj
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Pagesat</h2>
        {pays.map((method, index) => (
          <div key={method.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
            <span>{method.name}</span>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={method.isActive}
                onCheckedChange={async (value) => {
                  const next = { ...method, isActive: value === true };
                  setPays((current) => current.map((entry, i) => (i === index ? next : entry)));
                  await savePaymentMethodAction(next);
                  toast.success(t("admin.saved"));
                }}
              />
              Aktiv
            </label>
          </div>
        ))}
      </section>

      <Button nativeButton={false} render={<a href="/api/admin/newsletter.csv" />}>
        Eksporto newsletter
      </Button>
    </div>
  );

  function updateShip(index: number, patch: Partial<ShippingMethod>) {
    setMethods((current) => current.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  }
}
