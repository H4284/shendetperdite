"use client";

import { useEffect } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n/sq";

function pageHref(basePath: string, page: number) {
  if (page <= 1) return basePath;
  return `${basePath}?page=${page}`;
}

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label={t("catalog.pagination")}
      className="flex flex-wrap items-center justify-center gap-2 pt-8"
    >
      <Link
        href={pageHref(basePath, Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className="rounded-md border px-3 py-1.5 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        {t("catalog.previous")}
      </Link>
      {pages.map((entry) => (
        <Link
          key={entry}
          href={pageHref(basePath, entry)}
          aria-current={entry === page ? "page" : undefined}
          className={
            entry === page
              ? "rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
              : "rounded-md border px-3 py-1.5 text-sm"
          }
        >
          {entry}
        </Link>
      ))}
      <Link
        href={pageHref(basePath, Math.min(pageCount, page + 1))}
        aria-disabled={page >= pageCount}
        className="rounded-md border px-3 py-1.5 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        {t("catalog.next")}
      </Link>
    </nav>
  );
}
