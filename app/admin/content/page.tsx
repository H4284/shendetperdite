import { ContentEditor } from "@/components/admin/content-editor";
import { adminListBrands } from "@/lib/admin/queries";
import { getHomeContent } from "@/lib/content/home";
import { t } from "@/lib/i18n/sq";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [content, brands] = await Promise.all([getHomeContent(), adminListBrands()]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("admin.content")}</h1>
      <ContentEditor initial={content} brands={brands} />
    </div>
  );
}
