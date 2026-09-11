"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckoutForm, loadCheckoutDraft } from "@/components/checkout/checkout-form";
import { defaultPaymentMethods, defaultShippingMethods } from "@/lib/checkout/defaults";
import { defaultCheckoutValues, type CheckoutInput } from "@/lib/checkout/schema";
import { useCartStore } from "@/lib/cart/store";
import { t } from "@/lib/i18n/sq";
import type { PaymentMethod, ShippingMethod } from "@/types/checkout";

function mergeDraft(draft: Partial<CheckoutInput> | null): CheckoutInput {
  if (!draft) return defaultCheckoutValues;
  return {
    ...defaultCheckoutValues,
    ...draft,
    shipping: { ...defaultCheckoutValues.shipping, ...draft.shipping },
    billing: { ...defaultCheckoutValues.billing!, ...draft.billing },
  };
}

export function CheckoutView() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const discount = useCartStore((state) => state.discount);
  const [mounted, setMounted] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [initialValues, setInitialValues] = useState<CheckoutInput>(defaultCheckoutValues);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(defaultShippingMethods);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    defaultPaymentMethods.filter((method) => method.isActive),
  );

  useEffect(() => {
    const finish = () => setMounted(true);
    if (useCartStore.persist.hasHydrated()) finish();
    return useCartStore.persist.onFinishHydration(finish);
  }, []);

  useEffect(() => {
    setInitialValues(mergeDraft(loadCheckoutDraft()));
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      toast.message(t("checkout.emptyRedirect"));
      router.replace("/cart");
    }
    // Redirect only after the persisted cart hydrates, not after a successful order clears it.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [mounted, router]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout/methods")
      .then((response) => response.json())
      .then((data: { shipping?: ShippingMethod[]; payments?: PaymentMethod[] }) => {
        if (cancelled) return;
        if (data.shipping?.length) setShippingMethods(data.shipping);
        if (data.payments?.length) setPaymentMethods(data.payments);
      })
      .catch(() => {
        // Keep the built-in Standard / cash-on-delivery methods.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted || !draftReady || items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("cart.loading")}</p>;
  }

  return (
    <CheckoutForm
      items={items}
      discount={discount}
      initialValues={initialValues}
      shippingMethods={shippingMethods}
      paymentMethods={paymentMethods}
    />
  );
}
