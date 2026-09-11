"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OrderSummary } from "@/components/checkout/order-summary";
import { KOSOVO_CITIES } from "@/data/kosovo-cities";
import { formatEuroAmount } from "@/lib/cart/money";
import { placeOrder, OutOfStockClientError } from "@/lib/checkout/client";
import {
  checkoutSchema,
  type CheckoutAddress,
  type CheckoutInput,
} from "@/lib/checkout/schema";
import { defaultShippingMethods } from "@/lib/checkout/defaults";
import { loadAddresses, loadProfile } from "@/lib/account/data";
import { useAuthUser } from "@/lib/auth/use-user";
import { t } from "@/lib/i18n/sq";
import type { AppliedDiscount, CartItem } from "@/types/cart";
import type { PaymentMethod, ShippingMethod } from "@/types/checkout";

const DRAFT_KEY = "checkout_draft_v1";
const inputClass = "h-11";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">
        {label}
        {hint ? <span className="ml-1 font-normal text-muted-foreground">({hint})</span> : null}
      </span>
      {children}
      {error ? <span className="text-sm text-destructive">{error}</span> : null}
    </label>
  );
}

function AddressFields({
  prefix,
  register,
  errors,
}: {
  prefix: "shipping" | "billing";
  register: ReturnType<typeof useForm<CheckoutInput>>["register"];
  errors?: Partial<Record<keyof CheckoutAddress, { message?: string }>>;
}) {
  const listId = `${prefix}-kosovo-cities`;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={t("checkout.country")} error={errors?.country?.message}>
        <Input className={inputClass} value="Kosovë" readOnly />
        <input type="hidden" {...register(`${prefix}.country`)} />
      </Field>
      <Field label={t("checkout.city")} error={errors?.city?.message}>
        <Input className={inputClass} list={listId} autoComplete="address-level2" {...register(`${prefix}.city`)} />
        <datalist id={listId}>
          {KOSOVO_CITIES.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
      </Field>
      <Field label={t("checkout.recipient")} error={errors?.recipient?.message}>
        <Input className={inputClass} autoComplete="name" {...register(`${prefix}.recipient`)} />
      </Field>
      <Field
        label={t("checkout.postalCode")}
        hint={t("checkout.postalOptional")}
        error={errors?.postalCode?.message}
      >
        <Input className={inputClass} autoComplete="postal-code" {...register(`${prefix}.postalCode`)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t("checkout.address")} error={errors?.line1?.message}>
          <Input className={inputClass} autoComplete="street-address" {...register(`${prefix}.line1`)} />
        </Field>
      </div>
      <Field label={t("checkout.phone")} error={errors?.phone?.message}>
        <Input
          className={inputClass}
          type="tel"
          autoComplete="tel"
          placeholder="+383 49 123 456"
          {...register(`${prefix}.phone`)}
        />
      </Field>
    </div>
  );
}

export function CheckoutForm({
  items,
  discount,
  initialValues,
  shippingMethods,
  paymentMethods,
}: {
  items: CartItem[];
  discount: AppliedDiscount | null;
  initialValues: CheckoutInput;
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
}) {
  const router = useRouter();
  const form = useForm<CheckoutInput>({
    defaultValues: initialValues,
    mode: "onSubmit",
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const values = watch();
  const { user } = useAuthUser();
  const shipping =
    shippingMethods.find((method) => method.id === values.shippingMethodId) ??
    shippingMethods[0] ??
    defaultShippingMethods[0];

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    } catch {
      // Private mode can block sessionStorage.
    }
  }, [values]);

  useEffect(() => {
    if (!user) return;
    if (!getValues("email") && user.email) {
      setValue("email", user.email);
    }
    void (async () => {
      try {
        const [profile, addresses] = await Promise.all([
          loadProfile(user.uid),
          loadAddresses(user.uid),
        ]);
        const address =
          addresses.find((entry) => entry.isDefault) ?? addresses[0];
        if (!getValues("shipping.recipient")) {
          const name = profile.displayName || user.displayName || "";
          if (name) setValue("shipping.recipient", address?.recipient || name);
          if (profile.phone) setValue("shipping.phone", profile.phone);
        }
        if (address && !getValues("shipping.line1")) {
          setValue("shipping.city", address.city);
          setValue("shipping.recipient", address.recipient);
          setValue("shipping.line1", address.line1);
          if (address.postalCode) setValue("shipping.postalCode", address.postalCode);
          setValue("shipping.phone", address.phone);
        }
      } catch {
        // Prefill is best-effort if the profile docs are missing.
      }
    })();
  }, [user, getValues, setValue]);

  async function onSubmit(data: CheckoutInput) {
    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path.join(".") as Parameters<typeof form.setError>[0], {
          message: issue.message,
        });
      }
      return;
    }
    try {
      const result = await placeOrder(parsed.data);
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // Ignore draft cleanup failures.
      }
      router.push(`/orders/${result.id}/thank-you?token=${result.token}`);
    } catch (error) {
      if (error instanceof OutOfStockClientError) {
        toast.error(t("checkout.outOfStock", { sku: error.sku }));
        return;
      }
      toast.error(t("checkout.error"));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div className="space-y-8">
        <section className="space-y-4 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">{t("checkout.contact")}</h2>
          <Field label={t("checkout.email")} error={errors.email?.message}>
            <Input className={inputClass} type="email" autoComplete="email" {...register("email")} />
          </Field>
          {user ? null : (
            <>
              <Controller
                name="createAccount"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                    {t("checkout.createAccount")}
                  </label>
                )}
              />
              <p className="text-sm">
                <Link
                  href="/login?next=/checkout"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t("checkout.hasAccount")}
                </Link>
              </p>
            </>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">{t("checkout.shippingAddress")}</h2>
          <AddressFields prefix="shipping" register={register} errors={errors.shipping} />
        </section>

        <section className="space-y-4 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">{t("checkout.billingAddress")}</h2>
          <Controller
            name="sameBillingAddress"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                {t("checkout.sameBilling")}
              </label>
            )}
          />
          {values.sameBillingAddress ? null : (
            <AddressFields prefix="billing" register={register} errors={errors.billing} />
          )}
        </section>

        <section className="space-y-4 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">{t("checkout.shipping")}</h2>
          <Controller
            name="shippingMethodId"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
              >
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-data-checked:border-primary"
                  >
                    <RadioGroupItem value={method.id} />
                    <span className="flex-1">
                      <span className="block font-medium">{method.name}</span>
                      <span className="text-sm text-muted-foreground">{method.description}</span>
                    </span>
                    <span className="text-sm font-medium">{formatEuroAmount(method.price)}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        </section>

        <section className="space-y-4 rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">{t("checkout.payment")}</h2>
          <Controller
            name="paymentMethodId"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
              >
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-data-checked:border-primary"
                  >
                    <RadioGroupItem value={method.id} />
                    <span>
                      <span className="block font-medium">{method.name}</span>
                      <span className="text-sm text-muted-foreground">{method.description}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        </section>

        <Controller
          name="newsletterOptIn"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              {t("checkout.newsletter")}
            </label>
          )}
        />
      </div>

      <OrderSummary
        items={items}
        discount={discount}
        shippingMethod={shipping}
        submitting={isSubmitting}
      />
    </form>
  );
}

export function loadCheckoutDraft(): Partial<CheckoutInput> | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<CheckoutInput>) : null;
  } catch {
    return null;
  }
}
