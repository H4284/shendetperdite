import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  return (
    process.env.CHECKOUT_TOKEN_SECRET ||
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    "dev-checkout-token"
  );
}

export function signOrderToken(orderId: string) {
  return createHmac("sha256", secret()).update(orderId).digest("hex").slice(0, 32);
}

export function verifyOrderToken(orderId: string, token: string | null | undefined) {
  if (!token) return false;
  const expected = signOrderToken(orderId);
  const left = Buffer.from(expected);
  const right = Buffer.from(token);
  return left.length === right.length && timingSafeEqual(left, right);
}
