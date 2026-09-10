import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/storefront/product-card";
import type { Product } from "@/types/catalog";

export function ProductCarousel({
  title,
  subtitle,
  products,
  brandNames,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  brandNames: Record<string, string>;
}) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <Carousel opts={{ align: "start", dragFree: true }} className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
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
