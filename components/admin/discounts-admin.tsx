"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { deleteDiscountAction, saveDiscountAction } from "@/lib/admin/actions-orders";
import { t } from "@/lib/i18n/sq";
import type { Discount } from "@/types/discount";

export function DiscountsAdmin({ discounts }: { discounts: Discount[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed" | "free_shipping">("percent");
  const [value, setValue] = useState(10);
  const [minSubtotal, setMinSubtotal] = useState(0);
  const [usageLimit, setUsageLimit] = useState<number | "">(2);
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="space-y-6">
      <ul className="divide-y rounded-2xl border">
        {discounts.map((discount) => (
          <li key={discount.code} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
            <span>
              <strong>{discount.code}</strong> · {discount.type} {discount.value} · përdorime {discount.usedCount}
              {discount.usageLimit != null ? `/${discount.usageLimit}` : ""}
            </span>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                await deleteDiscountAction(discount.code);
                router.refresh();
              }}
            >
              Fshi
            </Button>
          </li>
        ))}
      </ul>
      <form
        className="grid gap-3 rounded-2xl border p-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          await saveDiscountAction({
            code,
            type,
            value: Number(value),
            minSubtotal: Number(minSubtotal),
            usageLimit: usageLimit === "" ? null : Number(usageLimit),
            isActive,
          });
          toast.success(t("admin.saved"));
          router.refresh();
        }}
      >
        <Input placeholder="Kodi" value={code} onChange={(e) => setCode(e.target.value)} required />
        <select className="h-9 rounded-lg border bg-background px-2 text-sm" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="percent">percent</option>
          <option value="fixed">fixed</option>
          <option value="free_shipping">free_shipping</option>
        </select>
        <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <Input type="number" value={minSubtotal} onChange={(e) => setMinSubtotal(Number(e.target.value))} />
        <Input
          type="number"
          placeholder="Limiti"
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={isActive} onCheckedChange={(value) => setIsActive(value === true)} />
          Aktiv
        </label>
        <Button type="submit">{t("admin.save")}</Button>
      </form>
    </div>
  );
}
