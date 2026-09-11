import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminUser } from "@/lib/auth/server";
import { getAdminAppInstance } from "@/lib/firebase/admin";
import { writeAuditLog } from "@/lib/admin/audit";
import { slugify } from "@/lib/admin/slug";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const actor = await getAdminUser();
  if (!actor) {
    return NextResponse.json({ error: "forbidden" }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "uploads");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(buffer).rotate().webp({ quality: 82 }).toBuffer();
  const name = `${folder.replace(/[^a-z0-9/_-]/gi, "")}/${Date.now()}-${slugify(file.name) || "image"}.webp`;
  const { getStorage } = await import("firebase-admin/storage");
  const bucket = getStorage(getAdminAppInstance()).bucket();
  const object = bucket.file(name);
  await object.save(webp, {
    contentType: "image/webp",
    resumable: false,
    metadata: { cacheControl: "public,max-age=31536000" },
  });
  await object.makePublic().catch(() => undefined);
  const url = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(name).replace(/%2F/g, "/")}`;

  await writeAuditLog({
    actor,
    action: "storage.upload",
    entity: "storage",
    entityId: name,
  });

  return NextResponse.json({ url, path: name });
}
