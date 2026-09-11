"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUploadButton } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { reorderCategoriesAction, saveBrandAction, saveCategoryAction } from "@/lib/admin/actions-catalog";
import { slugify } from "@/lib/admin/slug";
import { t } from "@/lib/i18n/sq";
import type { Brand, Category } from "@/types/catalog";

export function CategoriesAdmin({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [order, setOrder] = useState(categories.map((category) => category.id));
  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    parentId: "",
    isActive: true,
    seoTitle: "",
    seoDescription: "",
  });

  async function saveNew() {
    await saveCategoryAction({
      name: draft.name,
      slug: draft.slug || slugify(draft.name),
      description: draft.description,
      image: draft.image || null,
      parentId: draft.parentId || null,
      order: categories.length,
      isActive: draft.isActive,
      seo: { title: draft.seoTitle || draft.name, description: draft.seoDescription || draft.description || draft.name },
    });
    toast.success(t("admin.saved"));
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-2">
        <h2 className="font-semibold">Pema</h2>
        <ul className="space-y-2">
          {order.map((id, index) => {
            const category = categories.find((entry) => entry.id === id);
            if (!category) return null;
            return (
              <li key={id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                <span>
                  {category.parentId ? "↳ " : ""}
                  {category.name}
                </span>
                <span className="flex gap-1">
                  <Button type="button" variant="outline" onClick={() => move(index, -1)}>↑</Button>
                  <Button type="button" variant="outline" onClick={() => move(index, 1)}>↓</Button>
                </span>
              </li>
            );
          })}
        </ul>
        <Button
          type="button"
          onClick={async () => {
            await reorderCategoriesAction(order);
            toast.success(t("admin.saved"));
            router.refresh();
          }}
        >
          Ruaj renditjen
        </Button>
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">{t("admin.new")}</h2>
        <Input placeholder="Emri" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: slugify(e.target.value) })} />
        <Input placeholder="Slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
        <Textarea placeholder="Përshkrimi" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <select className="h-9 w-full rounded-lg border bg-background px-2 text-sm" value={draft.parentId} onChange={(e) => setDraft({ ...draft, parentId: e.target.value })}>
          <option value="">Pa prind</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <ImageUploadButton folder="categories" onUploaded={(url) => setDraft({ ...draft, image: url })} />
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={draft.isActive} onCheckedChange={(value) => setDraft({ ...draft, isActive: value === true })} />
          Aktive
        </label>
        <Button type="button" onClick={() => void saveNew()}>{t("admin.save")}</Button>
      </section>
    </div>
  );

  function move(index: number, delta: number) {
    setOrder((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
}

export function BrandsAdmin({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
    isActive: true,
  });

  return (
    <div className="space-y-6">
      <ul className="divide-y rounded-2xl border">
        {brands.map((brand) => (
          <li key={brand.id} className="flex items-center justify-between p-3 text-sm">
            <span>{brand.name}</span>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await saveBrandAction({ ...brand, isActive: !brand.isActive });
                router.refresh();
              }}
            >
              {brand.isActive ? "Çaktivizo" : "Aktivizo"}
            </Button>
          </li>
        ))}
      </ul>
      <div className="space-y-3 rounded-2xl border p-4">
        <h2 className="font-semibold">{t("admin.new")}</h2>
        <Input placeholder="Emri" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: slugify(e.target.value) })} />
        <Input placeholder="Slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
        <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <ImageUploadButton folder="brands" onUploaded={(url) => setDraft({ ...draft, logo: url })} />
        <Button
          type="button"
          onClick={async () => {
            await saveBrandAction({
              name: draft.name,
              slug: draft.slug || slugify(draft.name),
              description: draft.description,
              logo: draft.logo || null,
              isActive: draft.isActive,
              seo: { title: draft.name, description: draft.description || draft.name },
            });
            toast.success(t("admin.saved"));
            router.refresh();
          }}
        >
          {t("admin.save")}
        </Button>
      </div>
    </div>
  );
}
