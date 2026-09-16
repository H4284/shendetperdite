import { readFile } from "node:fs/promises";
import path from "node:path";
import { Markdown } from "@/lib/markdown";

export async function LegalPage({
  slug,
  tone = "default",
}: {
  slug: string;
  tone?: "default" | "calm";
}) {
  const filePath = path.join(process.cwd(), "content", "pages", `${slug}.md`);
  const content = await readFile(filePath, "utf8");
  const calm = tone === "calm";

  return (
    <article
      className={
        calm
          ? "mx-auto max-w-2xl px-4 py-20 md:py-28"
          : "mx-auto max-w-3xl px-4 py-16"
      }
    >
      <Markdown
        content={content}
        tone={tone}
        className={calm ? undefined : "space-y-5"}
      />
    </article>
  );
}
