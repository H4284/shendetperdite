import type { AppliedDiscount, CartItem } from "@/types/cart";
import type { CheckoutAddress } from "@/lib/checkout/schema";

export type StoredOrder = {
  id: string;
  orderNumber: string;
  status: string;
  customer: { email: string; uid: string | null };
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  items: CartItem[];
  subtotal: number;
  discount: (AppliedDiscount & { amount: number }) | null;
  shippingCost: number;
  total: number;
  paymentMethod: { id: string; name: string; type: string };
  shippingMethod: { id: string; name: string; eta?: string };
  newsletterOptIn: boolean;
  createdAt?: Date | null;
  timeline?: Array<{ status: string; at?: Date | null; note?: string }>;
};
