"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUploadButton } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveProductAction } from "@/lib/admin/actions-catalog";
import { optionKey, variantMatrix } from "@/lib/admin/matrix";
import { slugify } from "@/lib/admin/slug";
import { t } from "@/lib/i18n/sq";
import type { Brand, Category, CatalogImage, ProductOption, ProductWithVariants, Variant } from "@/types/catalog";

type VariantDraft = {
  id?: string;
  sku: string;
  optionValues: Record<string, string>;
  price: number;
  compareAtPrice: number | null;
  stockQty: number;
  isDefault: boolean;
  image: string | null;
};

export function ProductForm({
  product,
  brands,
  categories,
  related,
}: {
  product?: ProductWithVariants | null;
  brands: Brand[];
  categories: Category[];
  related: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [brandId, setBrandId] = useState(product?.brandId ?? brands[0]?.id ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categoryIds ?? []);
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<CatalogImage[]>(product?.images ?? []);
  const [options, setOptions] = useState<ProductOption[]>(
    product?.options?.length ? product.options : [],
  );
  const [basePrice, setBasePrice] = useState(product?.basePrice ?? 0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | "">(product?.compareAtPrice ?? "");
  const [unitAmount, setUnitAmount] = useState(product?.unit?.amount ?? 0);
  const [unitName, setUnitName] = useState(product?.unit?.unit ?? "g");
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [relatedIds, setRelatedIds] = useState<string[]>(product?.relatedProductIds ?? []);
  const [seoTitle, setSeoTitle] = useState(product?.seo?.title ?? "");
  const [seoDescription, setSeoDescription] = useState(product?.seo?.description ?? "");
  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants?.map(fromVariant) ?? [
      {
        sku: "",
        optionValues: {},
        price: product?.basePrice ?? 0,
        compareAtPrice: product?.compareAtPrice ?? null,
        stockQty: 0,
        isDefault: true,
        image: null,
      },
    ],
  );
  const [busy, setBusy] = useState(false);

  const generated = useMemo(() => variantMatrix(options), [options]);

  function syncVariants() {
    const existing = new Map(variants.map((variant) => [optionKey(variant.optionValues), variant]));
    const next = generated.map((optionValues, index) => {
      const current = existing.get(optionKey(optionValues));
      return (
        current ?? {
          sku: `${slugify(name) || "sku"}-${index + 1}`,
          optionValues,
          price: basePrice,
          compareAtPrice: compareAtPrice === "" ? null : Number(compareAtPrice),
          stockQty: 0,
          isDefault: index === 0,
          image: null,
        }
      );
    });
    setVariants(next);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await saveProductAction({
        id: product?.id,
        name,
        slug: slug || slugify(name),
        brandId,
        categoryIds,
        shortDescription,
        description,
        images: images.map((image, order) => ({ ...image, order })),
        options,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice === "" ? null : Number(compareAtPrice),
        unit: unitAmount > 0 ? { amount: Number(unitAmount), unit: unitName } : null,
        status,
        isNew,
        isBestSeller,
        relatedProductIds: relatedIds,
        seo: {
          title: seoTitle || name,
          description: seoDescription || shortDescription,
        },
        variants: variants.map((variant, index) => ({
          ...variant,
          isDefault: variant.isDefault || index === 0,
          price: Number(variant.price),
          stockQty: Number(variant.stockQty),
        })),
      });
      toast.success(t("admin.saved"));
      router.push(`/admin/products/${result.id}`);
      router.refresh();
    } catch {
      toast.error("Nuk u ruajt produkti.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Emri">
          <Input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!product) setSlug(slugify(event.target.value));
            }}
          />
        </Field>
        <Field label="Slug">
          <Input value={slug} onChange={(event) => setSlug(event.target.value)} />
        </Field>
        <Field label="Marka">
          <select
            className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
            value={brandId}
            onChange={(event) => setBrandId(event.target.value)}
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Statusi">
          <select
            className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </Field>
      </div>

      <Field label="Kategoritë">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const checked = categoryIds.includes(category.id);
            return (
              <label key={category.id} className="flex items-center gap-2 rounded-lg border px-2 py-1 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    setCategoryIds((current) =>
                      value === true
                        ? [...current, category.id]
                        : current.filter((id) => id !== category.id),
                    )
                  }
                />
                {category.name}
              </label>
            );
          })}
        </div>
      </Field>

      <Field label="Përshkrimi i shkurtër">
        <Textarea value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} />
      </Field>
      <Field label="Përshkrimi (markdown)">
        <Textarea
          className="min-h-40 font-mono text-sm"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Imazhet</h2>
          <ImageUploadButton
            folder={`products/${product?.id ?? "new"}`}
            onUploaded={(url) =>
              setImages((current) => [
                ...current,
                { url, alt: name || "Produkt", order: current.length },
              ])
            }
          />
        </div>
        <ul className="space-y-2">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="flex items-center gap-2">
              <Input
                value={image.alt}
                onChange={(event) =>
                  setImages((current) =>
                    current.map((entry, i) =>
                      i === index ? { ...entry, alt: event.target.value } : entry,
                    ),
                  )
                }
              />
              <Button type="button" variant="outline" onClick={() => moveImage(index, -1)}>
                ↑
              </Button>
              <Button type="button" variant="outline" onClick={() => moveImage(index, 1)}>
                ↓
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Çmimi bazë">
          <Input type="number" step="0.01" value={basePrice} onChange={(event) => setBasePrice(Number(event.target.value))} />
        </Field>
        <Field label="Krahaso me">
          <Input
            type="number"
            step="0.01"
            value={compareAtPrice}
            onChange={(event) => setCompareAtPrice(event.target.value === "" ? "" : Number(event.target.value))}
          />
        </Field>
        <Field label="Njësia (sasia)">
          <Input type="number" value={unitAmount} onChange={(event) => setUnitAmount(Number(event.target.value))} />
        </Field>
        <Field label="Njësia">
          <Input value={unitName} onChange={(event) => setUnitName(event.target.value)} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isNew} onCheckedChange={(value) => setIsNew(value === true)} />
        I ri
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isBestSeller} onCheckedChange={(value) => setIsBestSeller(value === true)} />
        Më i shitur
      </label>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Opsionet (max 2)</h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOptions((current) => current.length < 2 ? [...current, { name: "", values: [""] }] : current)}
          >
            {t("admin.add")}
          </Button>
          <Button type="button" variant="outline" onClick={syncVariants}>
            Gjenero variantet
          </Button>
        </div>
        {options.map((option, index) => (
          <div key={index} className="grid gap-2 rounded-xl border p-3 md:grid-cols-2">
            <Input
              placeholder="Emri (p.sh. Shija)"
              value={option.name}
              onChange={(event) =>
                setOptions((current) =>
                  current.map((entry, i) => (i === index ? { ...entry, name: event.target.value } : entry)),
                )
              }
            />
            <Input
              placeholder="Vlerat, të ndara me presje"
              value={option.values.join(", ")}
              onChange={(event) =>
                setOptions((current) =>
                  current.map((entry, i) =>
                    i === index
                      ? { ...entry, values: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) }
                      : entry,
                  ),
                )
              }
            />
          </div>
        ))}
      </section>

      <section className="space-y-3 overflow-x-auto">
        <h2 className="font-semibold">Variantet</h2>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">SKU</th>
              <th className="p-2">Opsionet</th>
              <th className="p-2">Çmimi</th>
              <th className="p-2">Stoku</th>
              <th className="p-2">Default</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr key={optionKey(variant.optionValues) || index} className="border-t">
                <td className="p-2">
                  <Input
                    value={variant.sku}
                    onChange={(event) =>
                      setVariants((current) =>
                        current.map((entry, i) => (i === index ? { ...entry, sku: event.target.value } : entry)),
                      )
                    }
                  />
                </td>
                <td className="p-2 text-muted-foreground">
                  {Object.values(variant.optionValues).join(" / ") || "—"}
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(event) =>
                      setVariants((current) =>
                        current.map((entry, i) =>
                          i === index ? { ...entry, price: Number(event.target.value) } : entry,
                        ),
                      )
                    }
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={variant.stockQty}
                    onChange={(event) =>
                      setVariants((current) =>
                        current.map((entry, i) =>
                          i === index ? { ...entry, stockQty: Number(event.target.value) } : entry,
                        ),
                      )
                    }
                  />
                </td>
                <td className="p-2">
                  <Checkbox
                    checked={variant.isDefault}
                    onCheckedChange={() =>
                      setVariants((current) =>
                        current.map((entry, i) => ({ ...entry, isDefault: i === index })),
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Field label="Produkte të lidhura">
        <div className="flex flex-wrap gap-2">
          {related.map((entry) => (
            <label key={entry.id} className="flex items-center gap-2 rounded-lg border px-2 py-1 text-sm">
              <Checkbox
                checked={relatedIds.includes(entry.id)}
                onCheckedChange={(value) =>
                  setRelatedIds((current) =>
                    value === true ? [...current, entry.id] : current.filter((id) => id !== entry.id),
                  )
                }
              />
              {entry.name}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO titulli">
          <Input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
        </Field>
        <Field label="SEO përshkrimi">
          <Input value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} />
        </Field>
      </div>

      <Button type="submit" disabled={busy}>
        {busy ? t("auth.submitting") : t("admin.save")}
      </Button>
    </form>
  );

  function moveImage(index: number, delta: number) {
    setImages((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((image, order) => ({ ...image, order }));
    });
  }
}

function fromVariant(variant: Variant): VariantDraft {
  return {
    id: variant.id,
    sku: variant.sku,
    optionValues: variant.optionValues,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    stockQty: variant.stockQty,
    isDefault: variant.isDefault,
    image: variant.image,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
