import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/storefront/product-card";
import { cn } from "cn";
import type { Product } from "@/types/catalog";

export function ProductCarousel({
  title,
  subtitle,
  products,
  brandNames,
  viewAllHref,
  viewAllLabel,
  eyebrow,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  brandNames: Record<string, string>;
  viewAllHref?: string;
  viewAllLabel?: string;
  eyebrow?: string;
  variant?: "default" | "campaign";
}) {
  if (products.length === 0) return null;

  const isCampaign = variant === "campaign";

  return (
    <section
      className={cn(
        "space-y-4",
        isCampaign &&
          "rounded-3xl border border-primary/15 bg-primary/[0.04] p-4 md:p-6",
      )}
    >
      <Carousel opts={{ align: "start", dragFree: true }} className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <p className="mb-1 text-xs font-semibold tracking-wide text-primary uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
            {viewAllHref && viewAllLabel && !isCampaign ? (
              <Link
                href={viewAllHref}
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                {viewAllLabel}
              </Link>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {viewAllHref && viewAllLabel && isCampaign ? (
              <Link
                href={viewAllHref}
                className="inline-flex h-8 items-center rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {viewAllLabel}
              </Link>
            ) : null}
            <CarouselPrevious className="static inset-auto size-8 translate-y-0" />
            <CarouselNext className="static inset-auto size-8 translate-y-0" />
          </div>
        </div>
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard
                product={product}
                brandName={brandNames[product.brandId] ?? ""}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
