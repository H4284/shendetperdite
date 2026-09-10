import Link from "next/link";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { Button } from "@/components/ui/button";

export type BrandPromoBlock = {
  id: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

export function BrandPromo({ blocks }: { blocks: BrandPromoBlock[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {blocks.map((block) => (
        <article
          key={block.id}
          className="relative min-h-[240px] overflow-hidden rounded-xl"
        >
          <CatalogImage
            src={block.image}
            alt={block.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative flex h-full min-h-[240px] flex-col justify-end gap-2 p-6 text-white">
            <h2 className="text-2xl font-semibold">{block.title}</h2>
            <p className="max-w-md text-sm text-white/90">{block.body}</p>
            <Button
              variant="secondary"
              className="w-fit"
              nativeButton={false}
              render={<Link href={block.href} />}
            >
              {block.cta}
            </Button>
          </div>
        </article>
      ))}
    </section>
  );
}
