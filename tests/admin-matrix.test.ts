import { describe, expect, it } from "vitest";
import { optionKey, variantMatrix } from "../lib/admin/matrix";
import { slugify } from "../lib/admin/slug";

describe("variant matrix", () => {
  it("builds 4 variants from 2 axes", () => {
    const rows = variantMatrix([
      { name: "Shija", values: ["Vanilje", "Çokollatë"] },
      { name: "Madhësia", values: ["400g", "1kg"] },
    ]);
    expect(rows).toHaveLength(4);
    expect(optionKey(rows[0])).toContain("Shija:");
  });
});

describe("slugify", () => {
  it("turns a product name into a slug", () => {
    expect(slugify("NOW Foods Vitamin D3")).toBe("now-foods-vitamin-d3");
  });
});
