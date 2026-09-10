export type NavChild = {
  name: string;
  slug: string;
};

export type NavItem = {
  name: string;
  slug: string;
  hasLanding: boolean;
  children: NavChild[];
};

export const siteConfig = {
  name: "Shëndet Përditë",
  description: "Health products for daily wellness.",
  email: "info@shendetperdite.com",
  phone: "+383 49 985 500",
  phoneHref: "tel:+38349985500",
  address: "Sokol Sopi 285, Prishtine",
  nav: [
    {
      name: "Vitamina & Minerale",
      slug: "vitamina-minerale",
      hasLanding: true,
      children: [
        { name: "Multivitamina", slug: "multivitamina" },
        { name: "Vitamina Individuale", slug: "vitamina-individuale" },
        { name: "Minerale", slug: "minerale" },
        { name: "Omega & Vajra", slug: "omega-vajra" },
        { name: "Imunitet", slug: "imunitet" },
      ],
    },
    {
      name: "Fitness",
      slug: "fitness",
      hasLanding: true,
      children: [
        { name: "Proteina", slug: "proteina" },
        { name: "Aksesorë", slug: "aksesore" },
        { name: "Kreatinë & Performancë", slug: "kreatine-performance" },
        { name: "Aminoacide", slug: "aminoacide" },
        { name: "Menaxhim Peshe", slug: "menaxhim-peshe" },
      ],
    },
    {
      name: "Shëndeti",
      slug: "shendeti",
      hasLanding: true,
      children: [
        { name: "Shëndeti i tretjes", slug: "shendeti-i-tretjes" },
        { name: "Shëndeti i zemrës", slug: "shendeti-i-zemres" },
        { name: "Shëndeti i trurit & fokusit", slug: "shendeti-i-trurit-fokusit" },
        { name: "Shëndeti i gjumit", slug: "shendeti-i-gjumit" },
      ],
    },
    {
      name: "Bukuri & Kujdes Personal",
      slug: "bukuri-kujdes-personal",
      hasLanding: true,
      children: [
        { name: "Flokë, Lëkurë & Thonj", slug: "floke-lekure-thonj" },
        { name: "Kolagjen", slug: "kolagjen" },
        { name: "Kremra & Kujdes Trupi", slug: "kremra-kujdes-trupi" },
      ],
    },
    {
      name: "Për Ty",
      slug: "per-ty",
      hasLanding: true,
      children: [
        { name: "Për Gra", slug: "per-gra" },
        { name: "Për Burra", slug: "per-burra" },
        { name: "Për Fëmijë", slug: "per-femije" },
      ],
    },
  ] satisfies NavItem[],
  footerLinks: [
    { name: "Rreth Nesh", href: "/about" },
    { name: "Dërgesat", href: "/shipping" },
    { name: "Kthimet", href: "/returns" },
    { name: "Politika e Privatësisë", href: "/privacy" },
    { name: "Termet dhe Kushtet", href: "/terms" },
  ],
  freeShippingFrom: 50,
  social: {
    instagram: "https://www.instagram.com/shendetperdite",
    facebook: "https://facebook.com/shendetperdite",
  },
} as const;

export function findNavBySlug(slug: string) {
  for (const item of siteConfig.nav) {
    if (item.slug === slug) return item;
    const child = item.children.find((entry) => entry.slug === slug);
    if (child) return child;
  }
  return null;
}

export function findNavParentSlug(slug: string) {
  for (const item of siteConfig.nav) {
    if (item.children.some((entry) => entry.slug === slug)) return item.slug;
  }
  return null;
}
