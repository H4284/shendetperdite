"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { bulkProductStatusAction } from "@/lib/admin/actions-catalog";
import { t } from "@/lib/i18n/sq";
import type { Brand, Category, Product } from "@/types/catalog";

export function ProductsTable({
  products,
  brands,
  categories,
}: {
  products: Product[];
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [brandId, setBrandId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const brandNames = useMemo(
    () => Object.fromEntries(brands.map((brand) => [brand.id, brand.name])),
    [brands],
  );

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (status !== "all" && product.status !== status) return false;
      if (brandId !== "all" && product.brandId !== brandId) return false;
      if (categoryId !== "all" && !product.categoryIds.includes(categoryId)) return false;
      if (query && !`${product.name} ${product.slug}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [products, query, status, brandId, categoryId]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        header: "",
        cell: ({ row }) => (
          <Checkbox
            checked={Boolean(selected[row.original.id])}
            onCheckedChange={(value) =>
              setSelected((current) => ({ ...current, [row.original.id]: value === true }))
            }
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Emri",
        cell: ({ row }) => (
          <Link className="text-primary hover:underline" href={`/admin/products/${row.original.id}`}>
            {row.original.name}
          </Link>
        ),
      },
      {
        id: "brand",
        header: "Marka",
        cell: ({ row }) => brandNames[row.original.brandId] ?? row.original.brandId,
      },
      { accessorKey: "status", header: "Statusi" },
      { accessorKey: "totalStock", header: "Stoku" },
      {
        accessorKey: "minPrice",
        header: "Çmimi",
        cell: ({ row }) => `${row.original.minPrice.toFixed(2)} €`,
      },
    ],
    [brandNames, selected],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const ids = Object.entries(selected).filter(([, on]) => on).map(([id]) => id);

  async function bulk(statusValue: "active" | "archived") {
    try {
      await bulkProductStatusAction(ids, statusValue);
      toast.success(t("admin.saved"));
      setSelected({});
      router.refresh();
    } catch {
      toast.error("Nuk u përditësua.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder={t("admin.search")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="h-9 rounded-lg border bg-background px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Të gjitha</option>
          <option value="draft">draft</option>
          <option value="active">active</option>
          <option value="archived">archived</option>
        </select>
        <select className="h-9 rounded-lg border bg-background px-2 text-sm" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
          <option value="all">Markat</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        <select className="h-9 rounded-lg border bg-background px-2 text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="all">Kategoritë</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <Button type="button" variant="outline" disabled={!ids.length} onClick={() => bulk("active")}>
          {t("admin.activate")}
        </Button>
        <Button type="button" variant="outline" disabled={!ids.length} onClick={() => bulk("archived")}>
          {t("admin.archive")}
        </Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} className="p-3">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
