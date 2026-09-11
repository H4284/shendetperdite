export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function orderStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Në pritje";
    case "confirmed":
      return "E konfirmuar";
    case "shipped":
      return "Në dërgesë";
    case "delivered":
      return "E dorëzuar";
    case "cancelled":
      return "Anuluar";
    default:
      return status;
  }
}
