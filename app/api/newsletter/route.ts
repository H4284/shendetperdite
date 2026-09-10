import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email } = bodySchema.parse(json);
    const normalized = email.trim().toLowerCase();
    const db = getAdminDb();
    const existing = await db
      .collection("newsletter")
      .where("email", "==", normalized)
      .limit(1)
      .get();

    if (existing.empty) {
      await db.collection("newsletter").add({
        email: normalized,
        createdAt: new Date(),
      });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
