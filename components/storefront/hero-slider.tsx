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
  textColor?: string;
};

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  return (
    <section className="relative">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => {
            const darkText = slide.textColor === "dark";
            return (
              <CarouselItem key={slide.id} className="pl-0">
                <div className="relative min-h-[360px] overflow-hidden md:min-h-[460px] lg:min-h-[560px]">
                  <CatalogImage
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                  <div
                    className={
                      darkText
                        ? "absolute inset-0 bg-gradient-to-t from-white/55 via-white/15 to-transparent"
                        : "absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent"
                    }
                  />
                  <div
                    className={`relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end gap-4 px-4 pb-14 pt-20 md:min-h-[460px] md:gap-5 md:pb-20 lg:min-h-[560px] ${darkText ? "text-neutral-900" : "text-white"}`}
                  >
                    {index === 0 ? (
                      <h1 className="max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl lg:text-[3.25rem]">
                        {slide.title}
                      </h1>
                    ) : (
                      <p className="max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl lg:text-[3.25rem]">
                        {slide.title}
                      </p>
                    )}
                    <p
                      className={`max-w-lg text-base leading-relaxed md:text-lg ${darkText ? "text-neutral-700" : "text-white/90"}`}
                    >
                      {slide.subtitle}
                    </p>
                    <Button
                      size="lg"
                      className="mt-1 w-fit"
                      nativeButton={false}
                      render={<Link href={slide.href} />}
                    >
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden border-white/40 bg-white/90 text-foreground md:inline-flex" />
        <CarouselNext className="right-4 hidden border-white/40 bg-white/90 text-foreground md:inline-flex" />
      </Carousel>
      <span className="sr-only">{t("home.title")}</span>
    </section>
  );
}
