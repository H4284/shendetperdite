import { t } from "@/lib/i18n/sq";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-20">
      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {t("home.eyebrow")}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">{t("home.title")}</h1>
      <p className="text-lg text-muted-foreground">{t("home.subtitle")}</p>
      <p className="max-w-xl text-muted-foreground">{t("home.body")}</p>
    </section>
  );
}
