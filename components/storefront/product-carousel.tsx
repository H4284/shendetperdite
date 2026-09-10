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
  products,
  brandNames,
}: {
  title: string;
  products: Product[];
  brandNames: Record<string, string>;
}) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <Carousel opts={{ align: "start", dragFree: true }} className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
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
