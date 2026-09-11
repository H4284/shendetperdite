import { render } from "@react-email/render";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { OrderEmail, type OrderEmailProps } from "@/emails/order-email";

type OrderEmailInput = Omit<OrderEmailProps, "audience">;

export async function sendOrderEmails(order: OrderEmailInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY is missing; order emails were skipped.");
    return { sent: false };
  }

  const resend = new Resend(key);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Shëndet Përditë <onboarding@resend.dev>";
  const admin = process.env.ORDERS_ADMIN_EMAIL ?? siteConfig.email;
  const [customerHtml, adminHtml] = await Promise.all([
    render(OrderEmail({ ...order, audience: "customer" })),
    render(OrderEmail({ ...order, audience: "admin" })),
  ]);

  await Promise.all([
    resend.emails.send({
      from,
      to: order.email,
      subject: `Porosia ${order.orderNumber} u pranua`,
      html: customerHtml,
    }),
    resend.emails.send({
      from,
      to: admin,
      subject: `Porosi e re ${order.orderNumber}`,
      html: adminHtml,
    }),
  ]);
  return { sent: true };
}
