/** Placeholder catalog types. The real data model lands in EPIC 2. */

export type Category = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  categoryIds: string[];
  price: number;
  currency: "EUR";
};
