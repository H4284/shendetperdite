import Image from "next/image";
import { cn } from "cn";

const BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' fill='%23f4efe8'/%3E%3C/svg%3E";

export function CatalogImage({
  src,
  alt,
  className,
  sizes,
  fill = false,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const svg = src.includes(".svg");
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      unoptimized={svg}
      placeholder={svg ? "empty" : "blur"}
      blurDataURL={svg ? undefined : BLUR}
      className={cn("object-cover", className)}
    />
  );
}
