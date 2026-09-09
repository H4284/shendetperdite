import { findNavBySlug } from "@/config/site";
import { t } from "@/lib/i18n/sq";

export default async function CategoryPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findNavBySlug(slug);
  const name = item?.name ?? slug;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t("category.title", { name })}
      </h1>
      <p className="mt-4 text-muted-foreground">{t("category.placeholder")}</p>
    </article>
  );
}
