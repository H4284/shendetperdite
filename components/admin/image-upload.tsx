"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/sq";

export function ImageUploadButton({
  folder,
  onUploaded,
}: {
  folder: string;
  onUploaded: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "upload_failed");
      onUploaded(data.url);
    } catch {
      toast.error("Ngarkimi i imazhit dështoi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="inline-flex">
      <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
      <Button type="button" variant="outline" disabled={busy} nativeButton={false} render={<span />}>
        {busy ? t("auth.submitting") : t("admin.upload")}
      </Button>
    </label>
  );
}
