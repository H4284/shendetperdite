import { t, type TranslationKey } from "@/lib/i18n/sq";

export function PlaceholderPage({
  titleKey,
}: {
  titleKey: TranslationKey;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t(titleKey)}</h1>
      <p className="mt-4 text-muted-foreground">{t("legal.placeholder")}</p>
    </article>
  );
}
