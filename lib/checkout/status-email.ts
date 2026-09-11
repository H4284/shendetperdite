import { render } from "@react-email/render";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { OrderEmail } from "@/emails/order-email";
import { orderStatusLabel } from "@/lib/auth/order-status";
import { getStoreSettings } from "@/lib/settings/store";
import type { StoredOrder } from "@/types/order";

export async function sendOrderStatusEmail(
  order: StoredOrder,
  status: string,
  note?: string,
) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !order.customer.email) {
    if (!key) console.warn("RESEND_API_KEY is missing; status email skipped.");
    return { sent: false };
  }
  const settings = await getStoreSettings();
  const resend = new Resend(key);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Shëndet Përditë <onboarding@resend.dev>";
  const label = orderStatusLabel(status);
  const html = await render(
    OrderEmail({
      orderNumber: order.orderNumber,
      email: order.customer.email,
      items: order.items.map((item) => ({
        name: item.name,
        variantLabel: item.variantLabel,
        qty: item.qty,
        price: item.price,
      })),
      subtotal: order.subtotal,
      discountAmount: order.discount?.amount ?? 0,
      shippingCost: order.shippingCost,
      total: order.total,
      audience: "customer",
      statusNote: note?.trim()
        ? `Statusi: ${label}. ${note.trim()}`
        : `Statusi i porosisë: ${label}.`,
    }),
  );

  await resend.emails.send({
    from,
    to: order.customer.email,
    subject: `Porosia ${order.orderNumber}: ${label}`,
    html,
  });
  return { sent: true, shop: settings.company.name, site: siteConfig.name };
}
