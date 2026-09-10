"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n/sq";

type SearchHit = {
  slug: string;
  name: string;
  brandName: string;
  price: number;
  image: { url: string; alt: string } | null;
};

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setPending(false);
      return;
    }

    setPending(true);
    const handle = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = (await response.json()) as { products?: SearchHit[] };
        setHits(data.products ?? []);
      } catch {
        setHits([]);
      } finally {
        setPending(false);
      }
    }, 250);

    return () => window.clearTimeout(handle);
  }, [open, query]);

  function goToSearch() {
    const q = query.trim();
    if (!q) return;
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function goToProduct(slug: string) {
    onOpenChange(false);
    router.push(`/products/${slug}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-1/4 translate-y-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("search.title")}</DialogTitle>
          <DialogDescription>{t("search.description")}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            goToSearch();
          }}
          className="flex items-center gap-2 border-b px-3"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("header.searchPlaceholder")}
            className="h-12 w-full bg-transparent text-sm outline-none"
            autoComplete="off"
            aria-label={t("search.title")}
          />
        </form>
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("search.hint")}
            </p>
          ) : pending && hits.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              …
            </p>
          ) : hits.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("search.empty")}
            </p>
          ) : (
            <ul className="space-y-1">
              {hits.map((hit) => (
                <li key={hit.slug}>
                  <button
                    type="button"
                    onClick={() => goToProduct(hit.slug)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      {hit.image ? (
                        <Image
                          src={hit.image.url}
                          alt={hit.image.alt}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{hit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {hit.brandName}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(hit.price)}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={goToSearch}
                  className="w-full rounded-md px-2 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
                >
                  {t("search.viewAll", { q: query.trim() })}
                </button>
              </li>
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
