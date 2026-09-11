"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n/sq";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", key: "admin.dashboard" as const },
  { href: "/admin/products", key: "admin.products" as const },
  { href: "/admin/categories", key: "admin.categories" as const },
  { href: "/admin/brands", key: "admin.brands" as const },
  { href: "/admin/orders", key: "admin.orders" as const },
  { href: "/admin/customers", key: "admin.customers" as const },
  { href: "/admin/discounts", key: "admin.discounts" as const },
  { href: "/admin/content", key: "admin.content" as const },
  { href: "/admin/settings", key: "admin.settings" as const },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm",
              active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {t(link.key)}
          </Link>
        );
      })}
    </nav>
  );
}
