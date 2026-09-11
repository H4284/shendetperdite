"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { KOSOVO_CITIES } from "@/data/kosovo-cities";
import { useAuthUser } from "@/lib/auth/use-user";
import {
  loadAddresses,
  removeAddress,
  saveAddress,
  setDefaultAddress,
} from "@/lib/account/data";
import { savedAddressSchema, type SavedAddress } from "@/types/account";
import { t } from "@/lib/i18n/sq";

const empty = {
  label: "Shtëpi",
  recipient: "",
  line1: "",
  city: "Prishtinë",
  postalCode: "",
  phone: "+383",
  country: "Kosovë" as const,
  isDefault: false,
};

export default function AddressesPage() {
  const { user, ready } = useAuthUser();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const form = useForm<typeof empty>({ defaultValues: empty });

  async function refresh(uid: string) {
    setAddresses(await loadAddresses(uid));
  }

  useEffect(() => {
    if (!user) return;
    void refresh(user.uid);
  }, [user]);

  async function onSubmit(values: typeof empty) {
    if (!user) return;
    const parsed = savedAddressSchema.safeParse({
      ...values,
      isDefault: values.isDefault || addresses.length === 0,
    });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path.join(".") as keyof typeof empty, {
          message: issue.message,
        });
      }
      return;
    }
    await saveAddress(user.uid, parsed.data, editing ?? undefined);
    toast.success(t("account.addressSaved"));
    form.reset(empty);
    setEditing(null);
    await refresh(user.uid);
  }

  if (!ready) return <p className="text-sm text-muted-foreground">{t("account.loading")}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t("account.addresses")}</h1>
      <ul className="space-y-3">
        {addresses.map((address) => (
          <li key={address.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border p-4">
            <div>
              <p className="font-medium">
                {address.label}
                {address.isDefault ? (
                  <span className="ml-2 text-xs text-primary">{t("account.default")}</span>
                ) : null}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.recipient}, {address.line1}, {address.city}
              </p>
            </div>
            <div className="flex gap-2">
              {address.isDefault ? null : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!user) return;
                    void setDefaultAddress(user.uid, address.id).then(() => refresh(user.uid));
                  }}
                >
                  {t("account.setDefault")}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(address.id);
                  form.reset(address);
                }}
              >
                {t("account.edit")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!user) return;
                  void removeAddress(user.uid, address.id).then(() => refresh(user.uid));
                }}
              >
                {t("account.delete")}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border p-5">
        <h2 className="font-semibold">
          {editing ? t("account.editAddress") : t("account.addAddress")}
        </h2>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("account.label")}</span>
          <Input className="h-11" {...form.register("label")} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("checkout.recipient")}</span>
          <Input className="h-11" {...form.register("recipient")} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("checkout.address")}</span>
          <Input className="h-11" {...form.register("line1")} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("checkout.city")}</span>
          <Input className="h-11" list="account-cities" {...form.register("city")} />
          <datalist id="account-cities">
            {KOSOVO_CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("checkout.phone")}</span>
          <Input className="h-11" {...form.register("phone")} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={form.watch("isDefault")}
            onCheckedChange={(checked) => form.setValue("isDefault", checked === true)}
          />
          {t("account.setDefault")}
        </label>
        <div className="flex gap-2">
          <Button type="submit">{t("account.save")}</Button>
          {editing ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditing(null);
                form.reset(empty);
              }}
            >
              {t("account.cancel")}
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
