import Link from "next/link";
import { requireAdmin } from "@/lib/auth/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { t } from "@/lib/i18n/sq";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="fixed inset-0 z-50 flex bg-background">
      <aside className="hidden w-56 shrink-0 overflow-y-auto border-r p-4 md:block">
        <p className="mb-4 px-3 text-sm font-semibold">{t("admin.title")}</p>
        <AdminNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="md:hidden">
            <AdminNav />
          </div>
          <p className="ml-auto text-sm text-muted-foreground">{user.email}</p>
          <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
            {t("admin.shop")}
          </Link>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
