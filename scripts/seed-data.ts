import { computeProductAggregates } from "../lib/catalog/aggregates";
import { buildSearchTokens } from "../lib/catalog/search-tokens";
import type { Brand, Category, Product, Variant } from "../types/catalog";

const IMAGE = "https://placehold.co/800x800/0f766e/ffffff.png";
const IMAGE_HOVER = "https://placehold.co/800x800/115e59/d1fae5.png";
const LOGO = "https://placehold.co/240x80/111111/ffffff.png";

const now = new Date("2026-09-01T10:00:00.000Z");

function daysAgo(days: number) {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export const seedCategories: Category[] = [
  {
    id: "vitamina-minerale",
    name: "Vitamina & Minerale",
    slug: "vitamina-minerale",
    description: "Vitamina, minerale dhe omega për shëndetin e përditshëm.",
    image: IMAGE,
    parentId: null,
    order: 0,
    isActive: true,
    seo: {
      title: "Vitamina & Minerale",
      description: "Vitamina dhe minerale të certifikuara.",
    },
  },
  {
    id: "fitness",
    name: "Fitness",
    slug: "fitness",
    description: "Proteina, kreatinë dhe suplementet e performancës.",
    image: IMAGE,
    parentId: null,
    order: 1,
    isActive: true,
    seo: { title: "Fitness", description: "Suplemente për stërvitje dhe performancë." },
  },
  {
    id: "shendeti",
    name: "Shëndeti",
    slug: "shendeti",
    description: "Mbështetje për tretjen, zemrën, gjumin dhe fokusin.",
    image: IMAGE,
    parentId: null,
    order: 2,
    isActive: true,
    seo: { title: "Shëndeti", description: "Produkte për shëndetin e përgjithshëm." },
  },
  {
    id: "bukuri-kujdes-personal",
    name: "Bukuri & Kujdes Personal",
    slug: "bukuri-kujdes-personal",
    description: "Kolagjen, kujdes për lëkurën, flokët dhe trupin.",
    image: IMAGE,
    parentId: null,
    order: 3,
    isActive: true,
    seo: {
      title: "Bukuri & Kujdes Personal",
      description: "Suplemente dhe kujdes personal.",
    },
  },
  {
    id: "per-ty",
    name: "Për Ty",
    slug: "per-ty",
    description: "Formula të përshtatura për gra, burra dhe fëmijë.",
    image: IMAGE,
    parentId: null,
    order: 4,
    isActive: true,
    seo: { title: "Për Ty", description: "Produkte sipas nevojave tuaja." },
  },
  {
    id: "proteina",
    name: "Proteina",
    slug: "proteina",
    description: "Whey, isolate dhe proteina bimore.",
    image: IMAGE,
    parentId: "fitness",
    order: 0,
    isActive: true,
    seo: { title: "Proteina", description: "Proteina për muskuj dhe rikuperim." },
  },
  {
    id: "aksesore",
    name: "Aksesorë",
    slug: "aksesore",
    description: "Aksesorë për stërvitje dhe suplementim.",
    image: IMAGE,
    parentId: "fitness",
    order: 1,
    isActive: true,
    seo: { title: "Aksesorë", description: "Aksesorë fitness." },
  },
  {
    id: "kreatine-performance",
    name: "Kreatinë & Performancë",
    slug: "kreatine-performance",
    description: "Kreatinë, pre-workout dhe performancë.",
    image: IMAGE,
    parentId: "fitness",
    order: 2,
    isActive: true,
    seo: { title: "Kreatinë & Performancë", description: "Suplemente për energji." },
  },
  {
    id: "aminoacide",
    name: "Aminoacide",
    slug: "aminoacide",
    description: "BCAA, EAA dhe aminoacide të tjera.",
    image: IMAGE,
    parentId: "fitness",
    order: 3,
    isActive: true,
    seo: { title: "Aminoacide", description: "Aminoacide për rikuperim." },
  },
  {
    id: "menaxhim-peshe",
    name: "Menaxhim Peshe",
    slug: "menaxhim-peshe",
    description: "L-Carnitine dhe mbështetje për peshën.",
    image: IMAGE,
    parentId: "fitness",
    order: 4,
    isActive: true,
    seo: { title: "Menaxhim Peshe", description: "Produkte për menaxhimin e peshës." },
  },
  {
    id: "multivitamina",
    name: "Multivitamina",
    slug: "multivitamina",
    description: "Multivitamina të plota për çdo ditë.",
    image: IMAGE,
    parentId: "vitamina-minerale",
    order: 0,
    isActive: true,
    seo: { title: "Multivitamina", description: "Multivitamina për të gjithë." },
  },
  {
    id: "shendeti-i-tretjes",
    name: "Shëndeti i tretjes",
    slug: "shendeti-i-tretjes",
    description: "Enzima, probiotikë dhe mbështetje e tretjes.",
    image: IMAGE,
    parentId: "shendeti",
    order: 0,
    isActive: true,
    seo: { title: "Shëndeti i tretjes", description: "Produkte për tretjen." },
  },
  {
    id: "per-gra",
    name: "Për Gra",
    slug: "per-gra",
    description: "Formula të dizajnuara për gratë.",
    image: IMAGE,
    parentId: "per-ty",
    order: 0,
    isActive: true,
    seo: { title: "Për Gra", description: "Suplemente për gratë." },
  },
];

export const seedBrands: Brand[] = [
  ["proteinocean", "Proteinocean", "Proteina dhe performancë."],
  ["now-foods", "NOW Foods", "Vitamina dhe minerale të njohura."],
  ["nowsports", "NOWSPORTS", "Linja sportive e NOW."],
  ["haliborange", "Haliborange", "Vitamina për familjen."],
  ["dietmed", "Dietmed", "Suplemente natyrale."],
  ["sambucol", "Sambucol", "Mbështetje për imunitetin."],
  ["vitabiotics", "VITABIOTICS", "Formula të specializuara."],
  ["solepharma", "SOLEPHARMA", "Produkte farmaceutike."],
  ["opko", "OPKO", "Shëndet dhe vitaminë C."],
  ["abdi-ibrahim", "ABDI IBRAHIM", "Markë e besuar rajonale."],
].map(([id, name, description]) => ({
  id,
  name,
  slug: id,
  logo: LOGO,
  description,
  isActive: true,
  seo: { title: name, description },
}));

type SeedVariant = Omit<Variant, "id"> & { id: string };
type SeedProduct = Omit<Product, "createdAt" | "updatedAt" | "searchTokens" | "minPrice" | "maxPrice" | "totalStock" | "defaultVariantId"> & {
  createdAt?: Date;
  variants: SeedVariant[];
};

function image(alt: string) {
  return [
    { url: IMAGE, alt, order: 0 },
    { url: IMAGE_HOVER, alt, order: 1 },
  ];
}

const seedProductDrafts: SeedProduct[] = [
  {
    id: "proteinocean-whey-protein",
    name: "Proteinocean Whey Protein",
    slug: "proteinocean-whey-protein",
    brandId: "proteinocean",
    categoryIds: ["fitness", "proteina"],
    shortDescription: "Whey protein me shije dhe masa të ndryshme.",
    description: "Proteinë whey për rikuperim pas stërvitjes.",
    images: image("Proteinocean Whey Protein"),
    options: [
      { name: "Shija", values: ["Cookie & Cream", "Biscuit"] },
      { name: "Masa", values: ["400g", "1600g", "2000g"] },
    ],
    basePrice: 22,
    compareAtPrice: 30,
    unit: { amount: 0.055, unit: "g" },
    status: "active",
    isNew: false,
    isBestSeller: true,
    relatedProductIds: ["nowsports-whey-protein-isolate", "proteinocean-clear-whey"],
    variants: [
      { id: "whey-cookie-400", sku: "PO-WHEY-CC-400", optionValues: { Shija: "Cookie & Cream", Masa: "400g" }, price: 22, compareAtPrice: 30, stockQty: 18, isDefault: true, image: IMAGE },
      { id: "whey-cookie-1600", sku: "PO-WHEY-CC-1600", optionValues: { Shija: "Cookie & Cream", Masa: "1600g" }, price: 46, compareAtPrice: 55, stockQty: 9, isDefault: false, image: IMAGE },
      { id: "whey-biscuit-400", sku: "PO-WHEY-BI-400", optionValues: { Shija: "Biscuit", Masa: "400g" }, price: 22, compareAtPrice: 30, stockQty: 12, isDefault: false, image: IMAGE },
      { id: "whey-biscuit-1600", sku: "PO-WHEY-BI-1600", optionValues: { Shija: "Biscuit", Masa: "1600g" }, price: 46, compareAtPrice: 55, stockQty: 7, isDefault: false, image: IMAGE },
    ],
  },
  {
    id: "nowsports-whey-protein-isolate",
    name: "NowSports Whey Protein Isolate",
    slug: "nowsports-whey-protein-isolate",
    brandId: "nowsports",
    categoryIds: ["fitness", "proteina"],
    shortDescription: "Whey isolate me dy shije dhe dy masa.",
    description: "Whey protein isolate me përmbajtje të lartë proteinash.",
    images: image("NowSports Whey Protein Isolate"),
    options: [
      { name: "Shija", values: ["Vanilje", "Çokollatë"] },
      { name: "Masa", values: ["680g", "2270g"] },
    ],
    basePrice: 40,
    compareAtPrice: 49,
    unit: { amount: 0.059, unit: "g" },
    status: "active",
    isNew: false,
    isBestSeller: true,
    relatedProductIds: ["proteinocean-whey-protein"],
    variants: [
      { id: "nsi-van-680", sku: "NS-WPI-VA-680", optionValues: { Shija: "Vanilje", Masa: "680g" }, price: 40, compareAtPrice: 49, stockQty: 10, isDefault: true, image: IMAGE },
      { id: "nsi-van-2270", sku: "NS-WPI-VA-2270", optionValues: { Shija: "Vanilje", Masa: "2270g" }, price: 78, compareAtPrice: 89, stockQty: 4, isDefault: false, image: IMAGE },
      { id: "nsi-ch-680", sku: "NS-WPI-CH-680", optionValues: { Shija: "Çokollatë", Masa: "680g" }, price: 40, compareAtPrice: 49, stockQty: 8, isDefault: false, image: IMAGE },
      { id: "nsi-ch-2270", sku: "NS-WPI-CH-2270", optionValues: { Shija: "Çokollatë", Masa: "2270g" }, price: 78, compareAtPrice: 89, stockQty: 3, isDefault: false, image: IMAGE },
    ],
  },
  {
    id: "proteinocean-clear-whey",
    name: "Proteinocean Clear Whey",
    slug: "proteinocean-clear-whey",
    brandId: "proteinocean",
    categoryIds: ["fitness", "proteina"],
    shortDescription: "Clear whey i lehtë, me shije frutash.",
    description: "Whey izolat i pastër, i lehtë për tu pirë.",
    images: image("Proteinocean Clear Whey"),
    options: [
      { name: "Shija", values: ["Limon", "Pjeshkë"] },
      { name: "Masa", values: ["500g", "1000g"] },
    ],
    basePrice: 28,
    compareAtPrice: 34,
    unit: { amount: 0.056, unit: "g" },
    status: "active",
    isNew: true,
    isBestSeller: false,
    relatedProductIds: ["proteinocean-whey-protein"],
    variants: [
      { id: "cw-lemon-500", sku: "PO-CW-LE-500", optionValues: { Shija: "Limon", Masa: "500g" }, price: 28, compareAtPrice: 34, stockQty: 14, isDefault: true, image: IMAGE },
      { id: "cw-lemon-1000", sku: "PO-CW-LE-1000", optionValues: { Shija: "Limon", Masa: "1000g" }, price: 49, compareAtPrice: 58, stockQty: 6, isDefault: false, image: IMAGE },
      { id: "cw-peach-500", sku: "PO-CW-PE-500", optionValues: { Shija: "Pjeshkë", Masa: "500g" }, price: 28, compareAtPrice: 34, stockQty: 11, isDefault: false, image: IMAGE },
      { id: "cw-peach-1000", sku: "PO-CW-PE-1000", optionValues: { Shija: "Pjeshkë", Masa: "1000g" }, price: 49, compareAtPrice: 58, stockQty: 5, isDefault: false, image: IMAGE },
    ],
  },
  {
    id: "proteinocean-mass-gainer",
    name: "Proteinocean Mass Gainer",
    slug: "proteinocean-mass-gainer",
    brandId: "proteinocean",
    categoryIds: ["fitness", "proteina"],
    shortDescription: "Mass gainer me dy shije dhe dy masa.",
    description: "Për rritje të peshës dhe masës muskulore.",
    images: image("Proteinocean Mass Gainer"),
    options: [
      { name: "Shija", values: ["Çokollatë", "Vanilje"] },
      { name: "Masa", values: ["1500g", "3000g"] },
    ],
    basePrice: 30,
    compareAtPrice: 45,
    unit: { amount: 0.02, unit: "g" },
    status: "active",
    isNew: false,
    isBestSeller: false,
    relatedProductIds: ["proteinocean-whey-protein"],
    variants: [
      { id: "mg-ch-1500", sku: "PO-MG-CH-1500", optionValues: { Shija: "Çokollatë", Masa: "1500g" }, price: 30, compareAtPrice: 45, stockQty: 9, isDefault: true, image: IMAGE },
      { id: "mg-ch-3000", sku: "PO-MG-CH-3000", optionValues: { Shija: "Çokollatë", Masa: "3000g" }, price: 52, compareAtPrice: 70, stockQty: 4, isDefault: false, image: IMAGE },
      { id: "mg-va-1500", sku: "PO-MG-VA-1500", optionValues: { Shija: "Vanilje", Masa: "1500g" }, price: 30, compareAtPrice: 45, stockQty: 7, isDefault: false, image: IMAGE },
      { id: "mg-va-3000", sku: "PO-MG-VA-3000", optionValues: { Shija: "Vanilje", Masa: "3000g" }, price: 52, compareAtPrice: 70, stockQty: 3, isDefault: false, image: IMAGE },
    ],
  },
  {
    id: "proteinocean-bcaa",
    name: "Proteinocean BCAA+",
    slug: "proteinocean-bcaa",
    brandId: "proteinocean",
    categoryIds: ["fitness", "aminoacide"],
    shortDescription: "BCAA me shije dhe masa të ndryshme.",
    description: "Aminoacide me zinxhir të degëzuar për rikuperim.",
    images: image("Proteinocean BCAA+"),
    options: [
      { name: "Shija", values: ["Portokall", "Mollë"] },
      { name: "Masa", values: ["300g", "500g"] },
    ],
    basePrice: 15,
    compareAtPrice: 20,
    unit: { amount: 0.05, unit: "g" },
    status: "active",
    isNew: false,
    isBestSeller: true,
    relatedProductIds: ["proteinocean-creatine"],
    variants: [
      { id: "bcaa-or-300", sku: "PO-BCAA-OR-300", optionValues: { Shija: "Portokall", Masa: "300g" }, price: 15, compareAtPrice: 20, stockQty: 20, isDefault: true, image: IMAGE },
      { id: "bcaa-or-500", sku: "PO-BCAA-OR-500", optionValues: { Shija: "Portokall", Masa: "500g" }, price: 22, compareAtPrice: 28, stockQty: 8, isDefault: false, image: IMAGE },
      { id: "bcaa-ap-300", sku: "PO-BCAA-AP-300", optionValues: { Shija: "Mollë", Masa: "300g" }, price: 15, compareAtPrice: 20, stockQty: 16, isDefault: false, image: IMAGE },
      { id: "bcaa-ap-500", sku: "PO-BCAA-AP-500", optionValues: { Shija: "Mollë", Masa: "500g" }, price: 22, compareAtPrice: 28, stockQty: 6, isDefault: false, image: IMAGE },
    ],
  },
];

const simpleProducts: Array<{
  id: string;
  name: string;
  brandId: string;
  categoryIds: string[];
  price: number;
  compareAtPrice: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  relatedProductIds?: string[];
  unit?: { amount: number; unit: string } | null;
  sku: string;
  stockQty: number;
  shortDescription: string;
}> = [
  { id: "nowsports-micronized-creatine", name: "NowSports Micronized Creatine Monohydrate", brandId: "nowsports", categoryIds: ["fitness", "kreatine-performance"], price: 20, compareAtPrice: 28, isBestSeller: true, sku: "NS-CRE-300", stockQty: 25, shortDescription: "Kreatinë mikronizuar për forcë.", relatedProductIds: ["proteinocean-creatine"] },
  { id: "proteinocean-creatine", name: "Proteinocean Creatine Unflavored", brandId: "proteinocean", categoryIds: ["fitness", "kreatine-performance"], price: 10, compareAtPrice: 20, sku: "PO-CRE-300", stockQty: 30, shortDescription: "Kreatinë pa shije.", relatedProductIds: ["nowsports-micronized-creatine"] },
  { id: "now-foods-magnesium-glycinate", name: "Now Foods Magnesium Glycinate", brandId: "now-foods", categoryIds: ["vitamina-minerale"], price: 35, compareAtPrice: null, isBestSeller: true, sku: "NF-MAG-180", stockQty: 22, shortDescription: "Magnezium glisinat për relaksim.", relatedProductIds: ["now-foods-ultra-omega-3"] },
  { id: "now-foods-ultra-omega-3", name: "Now Foods Ultra Omega 3-D Fish Oil", brandId: "now-foods", categoryIds: ["vitamina-minerale", "shendeti"], price: 31, compareAtPrice: null, sku: "NF-OM3-90", stockQty: 19, shortDescription: "Omega-3 me vitaminë D.", relatedProductIds: ["dietmed-omega"] },
  { id: "now-foods-vitamin-d3", name: "Now Foods Vitamin D3", brandId: "now-foods", categoryIds: ["vitamina-minerale", "multivitamina"], price: 12, compareAtPrice: 16, isNew: true, sku: "NF-D3-120", stockQty: 40, shortDescription: "Vitaminë D3 për imunitet.", relatedProductIds: ["opko-vitamin-c"] },
  { id: "sambucol-immune", name: "Sambucol Immune Formula", brandId: "sambucol", categoryIds: ["vitamina-minerale"], price: 18, compareAtPrice: null, sku: "SAM-IMM-120", stockQty: 15, shortDescription: "Mbështetje për imunitetin me elderberry.", relatedProductIds: ["opko-vitamin-c"] },
  { id: "vitabiotics-wellwoman", name: "Vitabiotics Wellwoman", brandId: "vitabiotics", categoryIds: ["per-ty", "per-gra", "multivitamina"], price: 24, compareAtPrice: 29, isNew: true, sku: "VB-WW-30", stockQty: 17, shortDescription: "Multivitaminë për gra.", relatedProductIds: ["haliborange-kids"] },
  { id: "haliborange-kids", name: "Haliborange Kids Multivitamin", brandId: "haliborange", categoryIds: ["per-ty", "multivitamina"], price: 14, compareAtPrice: null, sku: "HO-KIDS-30", stockQty: 21, shortDescription: "Vitamina për fëmijë.", relatedProductIds: ["vitabiotics-wellwoman"] },
  { id: "dietmed-omega", name: "Dietmed Omega Complex", brandId: "dietmed", categoryIds: ["vitamina-minerale", "shendeti"], price: 19, compareAtPrice: 25, sku: "DM-OMG-60", stockQty: 13, shortDescription: "Kompleks omega natyral.", relatedProductIds: ["now-foods-ultra-omega-3"] },
  { id: "solepharma-calcium", name: "Solepharma Calcium + D3", brandId: "solepharma", categoryIds: ["vitamina-minerale"], price: 16, compareAtPrice: null, sku: "SP-CAL-60", stockQty: 18, shortDescription: "Kalcium me vitaminë D3.", relatedProductIds: ["now-foods-magnesium-glycinate"] },
  { id: "opko-vitamin-c", name: "OPKO Vitamin C 1000", brandId: "opko", categoryIds: ["vitamina-minerale"], price: 9, compareAtPrice: 12, isNew: true, sku: "OP-VC-30", stockQty: 50, shortDescription: "Vitaminë C për imunitet.", relatedProductIds: ["sambucol-immune"] },
  { id: "abdi-ibrahim-zinc", name: "Abdi Ibrahim Zinc", brandId: "abdi-ibrahim", categoryIds: ["vitamina-minerale"], price: 11, compareAtPrice: null, sku: "AI-ZN-30", stockQty: 0, shortDescription: "Zink për imunitet dhe lëkurë.", relatedProductIds: ["opko-vitamin-c"] },
  { id: "nowsports-pre-workout", name: "NowSports Pre-Workout", brandId: "nowsports", categoryIds: ["fitness", "kreatine-performance"], price: 32, compareAtPrice: 39, sku: "NS-PRE-400", stockQty: 11, shortDescription: "Pre-workout për energji.", relatedProductIds: ["nowsports-micronized-creatine"] },
  { id: "proteinocean-l-carnitine", name: "Proteinocean L-Carnitine", brandId: "proteinocean", categoryIds: ["fitness", "menaxhim-peshe"], price: 15, compareAtPrice: 25, sku: "PO-LCAR-20", stockQty: 24, shortDescription: "L-Carnitine për energji dhe peshë.", relatedProductIds: ["proteinocean-bcaa"] },
  { id: "now-foods-probiotic", name: "Now Foods Probiotic-10", brandId: "now-foods", categoryIds: ["shendeti", "shendeti-i-tretjes"], price: 27, compareAtPrice: null, isNew: true, sku: "NF-PRO-50", stockQty: 16, shortDescription: "Probiotikë për tretjen.", relatedProductIds: ["now-foods-magnesium-glycinate"] },
];

for (const item of simpleProducts) {
  seedProductDrafts.push({
    id: item.id,
    name: item.name,
    slug: item.id,
    brandId: item.brandId,
    categoryIds: item.categoryIds,
    shortDescription: item.shortDescription,
    description: item.shortDescription,
    images: image(item.name),
    options: [],
    basePrice: item.price,
    compareAtPrice: item.compareAtPrice,
    unit: item.unit ?? null,
    status: "active",
    isNew: item.isNew ?? false,
    isBestSeller: item.isBestSeller ?? false,
    relatedProductIds: item.relatedProductIds ?? [],
    variants: [
      {
        id: "default",
        sku: item.sku,
        optionValues: {},
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        stockQty: item.stockQty,
        isDefault: true,
        image: IMAGE,
      },
    ],
  });
}

export const seedProducts = seedProductDrafts.map((product, index) => {
  const createdAt = daysAgo(seedProductDrafts.length - index);
  const aggregates = computeProductAggregates(product.variants, product.basePrice);
  const brand = seedBrands.find((entry) => entry.id === product.brandId);
  const categoryNames = seedCategories
    .filter((category) => product.categoryIds.includes(category.id))
    .map((category) => category.name);

  const document: Product = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brandId: product.brandId,
    categoryIds: product.categoryIds,
    shortDescription: product.shortDescription,
    description: product.description,
    images: product.images,
    options: product.options,
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice,
    unit: product.unit,
    status: product.status,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    relatedProductIds: product.relatedProductIds,
    searchTokens: buildSearchTokens(
      product.name,
      product.slug,
      product.shortDescription,
      brand?.name ?? "",
      ...categoryNames,
    ),
    ...aggregates,
    createdAt,
    updatedAt: createdAt,
  };

  return { product: document, variants: product.variants };
});
