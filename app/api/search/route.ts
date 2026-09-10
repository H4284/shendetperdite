import { NextRequest } from "next/server";
import { fetchBrands, fetchSearchProducts } from "@/lib/catalog/queries";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const products = await fetchSearchProducts(q);
  const brands = await fetchBrands();
  const brandNames = Object.fromEntries(
    brands.map((brand) => [brand.id, brand.name]),
  );

  return Response.json({
    products: products.slice(0, 8).map((product) => ({
      slug: product.slug,
      name: product.name,
      brandName: brandNames[product.brandId] ?? "",
      price: product.minPrice,
      image: product.images[0]
        ? { url: product.images[0].url, alt: product.images[0].alt }
        : null,
    })),
  });
}
