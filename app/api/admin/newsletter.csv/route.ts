import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/server";
import { adminNewsletterEmails } from "@/lib/admin/queries";

export const runtime = "nodejs";

export async function GET() {
  const actor = await getAdminUser();
  if (!actor) {
    return NextResponse.json({ error: "forbidden" }, { status: 401 });
  }
  const emails = await adminNewsletterEmails();
  const csv = `\uFEFFEmail\n${emails.join("\n")}`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="newsletter.csv"',
    },
  });
}
