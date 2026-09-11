import type { PaymentMethod, ShippingMethod } from "@/types/checkout";

export const defaultShippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard",
    description: "1–3 ditë pune",
    price: 2.5,
    freeFrom: 50,
    eta: "1–3 ditë pune",
    isActive: true,
  },
];

export const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "cash-on-delivery",
    name: "Para në dorë",
    description: "Pagesa do të mblidhet gjatë dorëzimit.",
    type: "cash_on_delivery",
    isActive: true,
  },
  {
    id: "card",
    name: "Kartelë",
    description: "Pagesa me kartelë (së shpejti).",
    type: "card",
    isActive: false,
  },
];
