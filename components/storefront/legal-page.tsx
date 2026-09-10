import { readFile } from "node:fs/promises";
import path from "node:path";
import { Markdown } from "@/lib/markdown";

export async function LegalPage({ slug }: { slug: string }) {
  const filePath = path.join(process.cwd(), "content", "pages", `${slug}.md`);
  const content = await readFile(filePath, "utf8");

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Markdown content={content} className="space-y-5" />
    </article>
  );
}
