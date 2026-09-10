import { describe, expect, it } from "vitest";
import {
  productDocumentSchema,
  variantDocumentSchema,
} from "../types/catalog";

const validProduct = {
  name: "Test Whey",
  slug: "test-whey",
  brandId: "proteinocean",
  categoryIds: ["fitness"],
  shortDescription: "Test",
  description: "Longer test description",
  images: [
    { url: "https://placehold.co/800x800.png", alt: "Test", order: 0 },
  ],
  options: [{ name: "Shija", values: ["Vanilje"] }],
  basePrice: 20,
  compareAtPrice: null,
  unit: { amount: 0.05, unit: "g" },
  status: "active" as const,
  isNew: false,
  isBestSeller: false,
  relatedProductIds: [],
  searchTokens: ["test", "whey"],
  minPrice: 20,
  maxPrice: 20,
  totalStock: 1,
  defaultVariantId: "default",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("catalog schemas reject invalid documents", () => {
  it("rejects a product with more than two option axes", () => {
    const result = productDocumentSchema.safeParse({
      ...validProduct,
      options: [
        { name: "Shija", values: ["A"] },
        { name: "Masa", values: ["B"] },
        { name: "Ngjyra", values: ["C"] },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown product status", () => {
    const result = productDocumentSchema.safeParse({
      ...validProduct,
      status: "published",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative price", () => {
    const result = productDocumentSchema.safeParse({
      ...validProduct,
      basePrice: -5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty slug", () => {
    const result = productDocumentSchema.safeParse({
      ...validProduct,
      slug: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a variant without a SKU", () => {
    const result = variantDocumentSchema.safeParse({
      sku: "",
      optionValues: { Shija: "Biscuit" },
      price: 22,
      compareAtPrice: null,
      stockQty: 4,
      isDefault: true,
      image: null,
    });
    expect(result.success).toBe(false);
  });
});
