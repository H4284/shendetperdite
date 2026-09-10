"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/sq";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  return (
    <section className="relative">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative min-h-[320px] overflow-hidden md:min-h-[420px] lg:min-h-[520px]">
                <CatalogImage
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative mx-auto flex min-h-[320px] max-w-7xl flex-col justify-end gap-3 px-4 py-12 text-white md:min-h-[420px] lg:min-h-[520px]">
                  {index === 0 ? (
                    <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
                      {slide.title}
                    </h1>
                  ) : (
                    <p className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
                      {slide.title}
                    </p>
                  )}
                  <p className="max-w-xl text-sm text-white/90 md:text-base">
                    {slide.subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="w-fit"
                    nativeButton={false}
                    render={<Link href={slide.href} />}
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden border-white/40 bg-white/90 text-foreground md:inline-flex" />
        <CarouselNext className="right-4 hidden border-white/40 bg-white/90 text-foreground md:inline-flex" />
      </Carousel>
      <span className="sr-only">{t("home.title")}</span>
    </section>
  );
}
