import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/server";
import { adminListOrders } from "@/lib/admin/queries";

export const runtime = "nodejs";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const actor = await getAdminUser();
  if (!actor) {
    return NextResponse.json({ error: "forbidden" }, { status: 401 });
  }
  const orders = await adminListOrders();
  const header = [
    "Numri",
    "Data",
    "Klienti",
    "Statusi",
    "Pagesa",
    "Totali",
    "Qyteti",
  ];
  const rows = orders.map((order) => [
    order.orderNumber,
    order.createdAt ? order.createdAt.toISOString() : "",
    order.customer.email,
    order.status,
    order.paymentMethod.name,
    String(order.total).replace(".", ","),
    order.shippingAddress?.city ?? "",
  ]);
  const csv = `\uFEFF${[header, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n")}`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="porosite.csv"',
    },
  });
}
