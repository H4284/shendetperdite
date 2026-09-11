import { FieldValue, type DocumentData, type Firestore } from "firebase-admin/firestore";
import { validateCartItems } from "@/lib/cart/validate";
import { cartSubtotal, discountAmount } from "@/lib/cart/selectors";
import { loadDiscount } from "@/lib/cart/discount-server";
import { validateDiscount } from "@/lib/cart/discount";
import { normalizePhone, type CheckoutInput } from "@/lib/checkout/schema";
import { orderTotal, shippingCostFor } from "@/lib/checkout/totals";
import { signOrderToken } from "@/lib/checkout/token";
import { defaultPaymentMethods, defaultShippingMethods } from "@/lib/checkout/defaults";
import type { AppliedDiscount, CartRequestItem } from "@/types/cart";
import type { PaymentMethod, ShippingMethod } from "@/types/checkout";
import { paymentMethodSchema, shippingMethodSchema } from "@/types/checkout";

export class OutOfStockError extends Error {
  sku: string;
  constructor(sku: string) {
    super("out_of_stock");
    this.name = "OutOfStockError";
    this.sku = sku;
  }
}

export class CheckoutError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.name = "CheckoutError";
    this.code = code;
  }
}

function parseShipping(id: string, data: DocumentData): ShippingMethod {
  return shippingMethodSchema.parse({ id, ...data });
}

function parsePayment(id: string, data: DocumentData): PaymentMethod {
  return paymentMethodSchema.parse({ id, ...data });
}

export async function loadCheckoutMethods(db: Firestore) {
  const [shippingSnap, paymentSnap] = await Promise.all([
    db.collection("shippingMethods").get(),
    db.collection("paymentMethods").get(),
  ]);

  const shipping =
    shippingSnap.empty
      ? defaultShippingMethods
      : shippingSnap.docs.map((doc) => parseShipping(doc.id, doc.data()));
  const payments =
    paymentSnap.empty
      ? defaultPaymentMethods
      : paymentSnap.docs.map((doc) => parsePayment(doc.id, doc.data()));

  return {
    shipping: shipping.filter((method) => method.isActive),
    payments: payments.filter((method) => method.isActive),
  };
}

function stripeEnabled() {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PAYMENTS === "true" &&
    Boolean(process.env.STRIPE_SECRET_KEY)
  );
}

export async function createOrder(
  db: Firestore,
  input: {
    checkout: CheckoutInput;
    items: CartRequestItem[];
    discountCode?: string;
    uid?: string | null;
  },
) {
  const methods = await loadCheckoutMethods(db);
  const shippingMethod = methods.shipping.find(
    (method) => method.id === input.checkout.shippingMethodId,
  );
  const paymentMethod = methods.payments.find(
    (method) => method.id === input.checkout.paymentMethodId,
  );

  if (!shippingMethod || !paymentMethod) {
    throw new CheckoutError("checkout_methods_missing");
  }
  if (paymentMethod.type === "card" && !stripeEnabled()) {
    throw new CheckoutError("card_disabled");
  }

  const validated = await validateCartItems(db, input.items);
  if (validated.items.length === 0) {
    throw new OutOfStockError("UNKNOWN");
  }
  const missing = input.items.find(
    (item) => !validated.items.some((line) => line.variantId === item.variantId && line.qty >= item.qty),
  );
  if (missing || validated.clamped.length > 0) {
    const fail = validated.clamped[0] ?? missing;
    const sku =
      validated.items.find((line) => line.variantId === fail?.variantId)?.sku ??
      missing?.productId ??
      "UNKNOWN";
    throw new OutOfStockError(sku);
  }

  const lines = validated.items;
  const subtotal = cartSubtotal(lines);
  let applied: (AppliedDiscount & { amount: number }) | null = null;

  if (input.discountCode) {
    const discount = await loadDiscount(input.discountCode);
    const check = validateDiscount(discount, subtotal);
    if (check.ok && discount) {
      applied = {
        code: discount.code,
        amount: discountAmount(subtotal, check.discount),
        type: discount.type,
        value: discount.value,
      };
    }
  }

  const shippingCost = shippingCostFor(subtotal, shippingMethod, applied);
  const total = orderTotal(subtotal, applied?.amount ?? 0, shippingCost);
  const billing = input.checkout.sameBillingAddress
    ? input.checkout.shipping
    : input.checkout.billing ?? input.checkout.shipping;

  const now = new Date();
  const orderRef = db.collection("orders").doc();

  await db.runTransaction(async (tx) => {
    for (const line of lines) {
      const variantRef = db
        .collection("products")
        .doc(line.productId)
        .collection("variants")
        .doc(line.variantId);
      const snap = await tx.get(variantRef);
      const stock = snap.data()?.stockQty ?? 0;
      if (!snap.exists || stock < line.qty) {
        throw new OutOfStockError(line.sku);
      }
    }

    const year = now.getUTCFullYear();
    const counterRef = db.collection("counters").doc("orders");
    const counterSnap = await tx.get(counterRef);
    const data = counterSnap.data() ?? {};
    const seq = data.year === year ? Number(data.seq ?? 0) + 1 : 1;
    const orderNumber = `SP-${year}-${String(seq).padStart(5, "0")}`;

    if (applied) {
      const discountRef = db.collection("discounts").doc(applied.code);
      const discountSnap = await tx.get(discountRef);
      const usedCount = Number(discountSnap.data()?.usedCount ?? 0);
      const usageLimit = discountSnap.data()?.usageLimit as number | null | undefined;
      if (usageLimit != null && usedCount >= usageLimit) {
        throw new CheckoutError("discount_exhausted");
      }
      tx.update(discountRef, { usedCount: FieldValue.increment(1) });
    }

    for (const line of lines) {
      const variantRef = db
        .collection("products")
        .doc(line.productId)
        .collection("variants")
        .doc(line.variantId);
      tx.update(variantRef, { stockQty: FieldValue.increment(-line.qty) });
    }

    tx.set(counterRef, { year, seq, updatedAt: now }, { merge: true });
    tx.set(orderRef, {
      orderNumber,
      status: "pending",
      customer: {
        email: input.checkout.email.trim().toLowerCase(),
        uid: input.uid ?? null,
      },
      shippingAddress: {
        ...input.checkout.shipping,
        phone: normalizePhone(input.checkout.shipping.phone),
      },
      billingAddress: {
        ...billing,
        phone: normalizePhone(billing.phone),
      },
      items: lines.map((line) => ({
        variantId: line.variantId,
        productId: line.productId,
        sku: line.sku,
        name: line.name,
        slug: line.slug,
        variantLabel: line.variantLabel,
        image: line.image,
        price: line.price,
        qty: line.qty,
      })),
      subtotal,
      discount: applied,
      shippingCost,
      total,
      paymentMethod: {
        id: paymentMethod.id,
        name: paymentMethod.name,
        type: paymentMethod.type,
      },
      shippingMethod: {
        id: shippingMethod.id,
        name: shippingMethod.name,
        eta: shippingMethod.eta,
      },
      newsletterOptIn: input.checkout.newsletterOptIn,
      createdAt: now,
      timeline: [{ status: "pending", at: now, note: "Porosia u krijua" }],
    });
  });

  const created = await orderRef.get();
  const orderNumber = String(created.data()?.orderNumber ?? "");
  return {
    id: orderRef.id,
    orderNumber,
    total,
    subtotal,
    discountAmount: applied?.amount ?? 0,
    shippingCost,
    items: lines.map((line) => ({
      name: line.name,
      variantLabel: line.variantLabel,
      qty: line.qty,
      price: line.price,
    })),
    token: signOrderToken(orderRef.id),
  };
}

export function isOutOfStockError(error: unknown): error is OutOfStockError {
  if (error instanceof OutOfStockError) return true;
  return (
    typeof error === "object" &&
    error !== null &&
    "sku" in error &&
    String((error as { message?: unknown }).message ?? "").startsWith("out_of_stock")
  );
}

export function checkoutErrorCode(error: unknown): string | null {
  if (error instanceof CheckoutError) return error.code;
  if (error instanceof Error) {
    if (
      error.message === "card_disabled" ||
      error.message === "checkout_methods_missing" ||
      error.message === "discount_exhausted"
    ) {
      return error.message;
    }
  }
  return null;
}
