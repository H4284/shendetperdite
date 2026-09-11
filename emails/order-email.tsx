import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { formatEuroAmount } from "@/lib/cart/money";
import { siteConfig } from "@/config/site";

export type OrderEmailProps = {
  orderNumber: string;
  email: string;
  items: { name: string; variantLabel: string; qty: number; price: number }[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  audience: "customer" | "admin";
  statusNote?: string;
};

export function OrderEmail({
  orderNumber,
  items,
  subtotal,
  discountAmount,
  shippingCost,
  total,
  audience,
  statusNote,
}: OrderEmailProps) {
  const title =
    audience === "admin"
      ? `Porosi e re ${orderNumber}`
      : `Faleminderit për porosinë ${orderNumber}`;

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={{ backgroundColor: "#f7f4ef", fontFamily: "Arial, sans-serif", color: "#222" }}>
        <Container style={{ backgroundColor: "#fff", padding: "24px", maxWidth: "560px" }}>
          <Heading as="h1" style={{ fontSize: "22px", color: "#844502" }}>
            {title}
          </Heading>
          <Text>
            {statusNote
              ? statusNote
              : audience === "admin"
                ? "Një porosi e re u vendos në Shëndet Përditë."
                : "Do të kontaktoheni për konfirmim. Pagesa mblidhet gjatë dorëzimit."}
          </Text>
          <Section>
            {items.map((item) => (
              <Text key={`${item.name}-${item.variantLabel}`}>
                {item.qty} × {item.name}
                {item.variantLabel ? ` — ${item.variantLabel}` : ""} · {formatEuroAmount(item.price)}
              </Text>
            ))}
          </Section>
          <Hr />
          <Text>Nëntotali: {formatEuroAmount(subtotal)}</Text>
          {discountAmount > 0 ? <Text>Zbritja: −{formatEuroAmount(discountAmount)}</Text> : null}
          <Text>Dërgesa: {formatEuroAmount(shippingCost)}</Text>
          <Text>
            <strong>Totali: {formatEuroAmount(total)}</strong>
          </Text>
          <Text>
            {siteConfig.name}
            <br />
            {siteConfig.phone}
            <br />
            {siteConfig.email}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderEmail;
