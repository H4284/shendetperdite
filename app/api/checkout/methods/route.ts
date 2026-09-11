import { getAdminDb } from "@/lib/firebase/admin";
import { loadCheckoutMethods } from "@/lib/checkout/create-order";

export const runtime = "nodejs";

export async function GET() {
  try {
    const methods = await loadCheckoutMethods(getAdminDb());
    return Response.json(methods);
  } catch (error) {
    console.error("GET /api/checkout/methods failed", error);
    return Response.json({ shipping: [], payments: [] }, { status: 500 });
  }
}
