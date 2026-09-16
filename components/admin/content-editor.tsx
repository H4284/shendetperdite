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
        <div className="space-y-1">
          <h2 className="font-semibold">Hero</h2>
          <p className="text-sm text-muted-foreground">
            Një CTA e qartë për slide: veprim i shkurtër (p.sh. «Shiko Ofertat», «Eksploro NOW Foods»).
            Shmang fraza të gjata ose dy butona në të njëjtin slide.
          </p>
        </div>
        {content.heroSlides.map((slide, index) => (
          <div key={slide.id} className="grid gap-3 rounded-2xl border p-3 md:grid-cols-2">
            <Field label="Titulli">
              <Input
                value={slide.title}
                placeholder="p.sh. Vitamina për çdo ditë"
                onChange={(e) => updateSlide(index, { title: e.target.value })}
              />
            </Field>
            <Field label="Nëntitulli">
              <Input
                value={slide.subtitle}
                placeholder="Një fjali mbështetëse"
                onChange={(e) => updateSlide(index, { subtitle: e.target.value })}
              />
            </Field>
            <Field label="Linku (href)" hint="Rruga e brendshme, p.sh. /offers ose /brands/now-foods">
              <Input
                value={slide.href}
                placeholder="/offers"
                onChange={(e) => updateSlide(index, { href: e.target.value })}
              />
            </Field>
            <Field
              label="Teksti i CTA"
              hint="2–4 fjalë, një veprim. Shembull: Shiko Ofertat · Eksploro markën"
            >
              <Input
                value={slide.cta}
                placeholder="Shiko Ofertat"
                onChange={(e) => updateSlide(index, { cta: e.target.value })}
              />
            </Field>
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
        <div className="space-y-1">
          <h2 className="font-semibold">Promo të markave</h2>
          <p className="text-sm text-muted-foreground">
            Një CTA për bllok: zakonisht «Shiko [Marka]». Linku duhet të çojë te faqja e markës ose kategorisë.
          </p>
        </div>
        {content.brandPromos.map((block, index) => (
          <div key={block.id} className="grid gap-3 rounded-2xl border p-3 md:grid-cols-2">
            <Field label="Titulli">
              <Input
                value={block.title}
                placeholder="p.sh. NOW Foods"
                onChange={(e) => updatePromo(index, { title: e.target.value })}
              />
            </Field>
            <Field label="Teksti">
              <Input
                value={block.body}
                placeholder="Një fjali e shkurtër për markën"
                onChange={(e) => updatePromo(index, { body: e.target.value })}
              />
            </Field>
            <Field label="Linku (href)" hint="Zakonisht /brands/…">
              <Input
                value={block.href}
                placeholder="/brands/now-foods"
                onChange={(e) => updatePromo(index, { href: e.target.value })}
              />
            </Field>
            <Field
              label="Teksti i CTA"
              hint="2–4 fjalë. Shembull: Shiko NOW Foods"
            >
              <Input
                value={block.cta}
                placeholder="Shiko NOW Foods"
                onChange={(e) => updatePromo(index, { cta: e.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={block.active !== false}
                onCheckedChange={(value) => updatePromo(index, { active: value === true })}
              />
              Aktiv
            </label>
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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {hint ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
      {children}
    </div>
  );
}
