import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";
import { attachCustomerAccount, uidFromAuthorization } from "@/lib/checkout/account";
import { saveCustomerAddress, subscribeNewsletter } from "@/lib/checkout/after-order";
import {
  checkoutErrorCode,
  createOrder,
  isOutOfStockError,
} from "@/lib/checkout/create-order";
import { sendOrderEmails } from "@/lib/checkout/emails";
import { checkoutSchema } from "@/lib/checkout/schema";
import { validateCartItems } from "@/lib/cart/validate";
import { cartRequestItemSchema } from "@/types/cart";

export const runtime = "nodejs";

const bodySchema = z.object({
  checkout: z.unknown(),
  items: z.array(cartRequestItemSchema).max(50),
  discountCode: z.string().optional(),
});

export async function POST(request: Request) {
  const limited = rateLimit(`orders:${clientIp(request)}`, 10, 60_000);
  if (!limited.ok) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const db = getAdminDb();
  let parsedItems: z.infer<typeof bodySchema>["items"] = [];

  try {
    const json = await request.json();
    const body = bodySchema.parse(json);
    parsedItems = body.items;
    const checkout = checkoutSchema.parse(body.checkout);
    if (body.items.length === 0) {
      return Response.json({ error: "empty_cart" }, { status: 400 });
    }

    let uid = await uidFromAuthorization(request.headers.get("authorization"));
    if (!uid && checkout.createAccount) {
      const account = await attachCustomerAccount(checkout.email);
      uid = account.uid;
    }

    const created = await createOrder(db, {
      checkout,
      items: body.items,
      discountCode: body.discountCode,
      uid,
    });

    if (checkout.newsletterOptIn) {
      try {
        await subscribeNewsletter(db, checkout.email);
      } catch (error) {
        console.warn("Newsletter opt-in failed", error);
      }
    }
    if (uid) {
      try {
        await saveCustomerAddress(db, uid, checkout.email, checkout.shipping);
      } catch (error) {
        console.warn("Could not save the customer address", error);
      }
    }

    try {
      await sendOrderEmails({
        orderNumber: created.orderNumber,
        email: checkout.email.trim().toLowerCase(),
        items: created.items,
        subtotal: created.subtotal,
        discountAmount: created.discountAmount,
        shippingCost: created.shippingCost,
        total: created.total,
      });
    } catch (error) {
      console.warn("Order emails failed", error);
    }

    return Response.json({
      id: created.id,
      orderNumber: created.orderNumber,
      total: created.total,
      token: created.token,
    });
  } catch (error) {
    if (isOutOfStockError(error)) {
      const result = await validateCartItems(db, parsedItems);
      return Response.json(
        {
          error: "out_of_stock",
          sku: error.sku,
          items: result.items,
          clamped: result.clamped,
        },
        { status: 409 },
      );
    }
    const code = checkoutErrorCode(error);
    if (code === "card_disabled") {
      return Response.json({ error: code }, { status: 400 });
    }
    if (code === "discount_exhausted") {
      return Response.json({ error: code }, { status: 409 });
    }
    if (error instanceof z.ZodError) {
      return Response.json({ error: "invalid", issues: error.issues }, { status: 400 });
    }
    console.error("POST /api/orders failed", error);
    return Response.json({ error: "order_failed" }, { status: 500 });
  }
}
