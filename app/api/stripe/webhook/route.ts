export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { error: "stripe_disabled" },
    { status: 501 },
  );
}
