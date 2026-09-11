import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";
import { validateCartItems } from "@/lib/cart/validate";
import { cartRequestItemSchema } from "@/types/cart";

const bodySchema = z.object({
  items: z.array(cartRequestItemSchema).max(50),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { items } = bodySchema.parse(json);
    const result = await validateCartItems(getAdminDb(), items);
    return Response.json(result);
  } catch {
    return Response.json({ items: [], clamped: [] }, { status: 400 });
  }
}
