"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUploadButton } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { saveHomeContentAction } from "@/lib/admin/actions-content";
import { t } from "@/lib/i18n/sq";
import type { Brand } from "@/types/catalog";
import type { HomeContent } from "@/types/content";

export function ContentEditor({
  initial,
  brands,
}: {
  initial: HomeContent;
  brands: Brand[];
}) {
  const router = useRouter();
  const [content, setContent] = useState(initial);

  return (
    <form
      className="space-y-8"
      onSubmit={async (event) => {
        event.preventDefault();
        await saveHomeContentAction(content);
        toast.success(t("admin.saved"));
        router.refresh();
      }}
    >
      <section className="space-y-3">
        <h2 className="font-semibold">Hero</h2>
        {content.heroSlides.map((slide, index) => (
          <div key={slide.id} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-2">
            <Input value={slide.title} onChange={(e) => updateSlide(index, { title: e.target.value })} />
            <Input value={slide.subtitle} onChange={(e) => updateSlide(index, { subtitle: e.target.value })} />
            <Input value={slide.href} onChange={(e) => updateSlide(index, { href: e.target.value })} />
            <Input value={slide.cta} onChange={(e) => updateSlide(index, { cta: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={slide.active !== false}
                onCheckedChange={(value) => updateSlide(index, { active: value === true })}
              />
              Aktiv
            </label>
            <ImageUploadButton folder="content/hero" onUploaded={(url) => updateSlide(index, { image: url })} />
          </div>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Promo të markave</h2>
        {content.brandPromos.map((block, index) => (
          <div key={block.id} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-2">
            <Input value={block.title} onChange={(e) => updatePromo(index, { title: e.target.value })} />
            <Input value={block.body} onChange={(e) => updatePromo(index, { body: e.target.value })} />
            <Input value={block.href} onChange={(e) => updatePromo(index, { href: e.target.value })} />
            <ImageUploadButton folder="content/promo" onUploaded={(url) => updatePromo(index, { image: url })} />
          </div>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Markat e besuara (renditja)</h2>
        <p className="text-sm text-muted-foreground">ID-të, të ndara me presje. Bosh = renditja default.</p>
        <Input
          value={content.trustedBrandIds.join(", ")}
          onChange={(e) =>
            setContent((current) => ({
              ...current,
              trustedBrandIds: e.target.value.split(",").map((value) => value.trim()).filter(Boolean),
            }))
          }
        />
        <p className="text-xs text-muted-foreground">
          {brands.map((brand) => `${brand.name} (${brand.id})`).join(" · ")}
        </p>
      </section>
      <Button type="submit">{t("admin.save")}</Button>
    </form>
  );

  function updateSlide(index: number, patch: Partial<HomeContent["heroSlides"][number]>) {
    setContent((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)),
    }));
  }
  function updatePromo(index: number, patch: Partial<HomeContent["brandPromos"][number]>) {
    setContent((current) => ({
      ...current,
      brandPromos: current.brandPromos.map((block, i) => (i === index ? { ...block, ...patch } : block)),
    }));
  }
}
