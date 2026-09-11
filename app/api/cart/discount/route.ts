import { z } from "zod";
import { evaluateDiscount } from "@/lib/cart/discount-server";

const bodySchema = z.object({
  code: z.string().min(1).max(40),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { code, subtotal } = bodySchema.parse(json);
    const result = await evaluateDiscount(code, subtotal);
    if (!result.ok) {
      return Response.json(result, { status: 400 });
    }
    return Response.json(result);
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }
}
