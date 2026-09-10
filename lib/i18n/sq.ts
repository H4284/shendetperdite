const sq = {
  skipToContent: "Kalo te përmbajtja",
  header: {
    primaryNav: "Navigimi kryesor",
    searchPlaceholder: "Kërko produkte...",
    searchShortcutMac: "⌘K",
    searchShortcutWin: "Ctrl+K",
    searchAria: "Hap kërkimin",
    cart: "Shporta",
    menu: "Menu",
    closeMenu: "Mbyll menunë",
    themeToggle: "Ndrysho temën",
    themeLight: "Tema e çelët",
    themeDark: "Tema e errët",
  },
  search: {
    title: "Kërko produkte",
    description: "Kërko në katalogun e Shëndet Përditë",
    empty: "Nuk u gjet asnjë rezultat.",
    hint: "Shkruani për të kërkuar produktet.",
    products: "Produkte",
    viewAll: "Shiko të gjitha rezultatet për “{q}”",
  },
  cookie: {
    region: "Cookies dhe privatësia",
    body: "Përdorim cookies për të përmirësuar përvojën tuaj të blerjes dhe për t'ju shfaqur oferta që ju përshtaten. Të dhënat tuaja nuk i shesim askujt.",
    privacy: "Politika e privatësisë",
    settings: "Cilësimet e cookies",
    accept: "Në rregull",
    settingsTitle: "Cilësimet e cookies",
    settingsDescription:
      "Zgjidhni cilat cookies dëshironi të lejoni. Cookies e nevojshme janë gjithmonë aktive.",
    necessary: "Të nevojshme",
    necessaryHelp: "Të nevojshme për funksionimin e faqes.",
    analytics: "Analitika",
    analyticsHelp: "Na ndihmojnë të kuptojmë se si përdoret faqja.",
    save: "Ruaj cilësimet",
  },
  footer: {
    nav: "Fundi i faqes",
    copyright: "© {year} {name}. Të gjitha të drejtat e rezervuara.",
  },
  home: {
    eyebrow: "Dyqani i shtesave ushqimore",
    title: "Shëndet Përditë",
    subtitle: "Health products for daily wellness.",
    limitedOffers: "Oferta të limituara",
    bestSellers: "Më të shiturat",
    newArrivals: "Të reja",
    trustedBrands: "Brendet e besuara",
    categories: "Kategoritë",
    newsletterTitle: "Abonohu në buletinin tonë",
    newsletterBody:
      "Merr oferta dhe këshilla shëndetësore drejt e në email. Pa spam.",
    newsletterPlaceholder: "Email-i juaj",
    newsletterSubmit: "Abonohu",
    newsletterSuccess: "Faleminderit! Jeni abonuar.",
    newsletterError: "Nuk mundëm të ruajmë email-in. Provoni përsëri.",
    newsletterInvalid: "Shkruani një email të vlefshëm.",
    freeShipping: "Transport falas për porosi mbi {amount}",
    shopNow: "Blej tani",
  },
  catalog: {
    home: "Ballina",
    inStock: "Në stok",
    outOfStock: "Pa stok",
    page: "Faqja {page}",
    previous: "E mëparshme",
    next: "E radhës",
    empty: "Nuk ka produkte në këtë listë për momentin.",
    pagination: "Faqet e katalogut",
  },
  product: {
    addToCart: "Shto në shportë",
    addedToCart: "U shtua në shportë",
    shippingTitle: "Dërgesa",
    freeShipping: "Transport falas për porosi mbi {amount}",
    delivery: "Dorëzimi brenda: 1–3 ditë",
    categories: "Kategori",
    similar: "Produkte të ngjashme",
    alsoBought: "Klientët gjithashtu kanë blerë",
    description: "Përshkrimi",
    options: "Opsionet",
    gallery: "Galeria e produktit",
    thumbnail: "Imazhi {n}",
  },
  error: {
    title: "Diçka shkoi keq",
    body: "Nuk mundëm të ngarkojmë këtë faqe. Provoni përsëri.",
    retry: "Provo përsëri",
  },
  notFound: {
    title: "Faqja nuk u gjet",
    body: "Kjo faqe nuk ekziston ose produkti nuk është më aktiv.",
    home: "Kthehu në ballinë",
  },
  legal: {
    placeholder: "Përmbajtja e kësaj faqeje do të përditësohet së shpejti.",
    rrethNesh: "Rreth Nesh",
    dergesat: "Politika e dërgesave",
    kthimet: "Politika e kthimit",
    privatesia: "Politika e privatësisë",
    termet: "Termet dhe kushtet",
  },
  category: {
    title: "{name}",
    placeholder: "Produktet e kësaj kategorie do të shfaqen këtu.",
  },
} as const;

type Dict = typeof sq;

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type Leaves<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: T[K] extends Record<string, unknown>
        ? Join<K, Leaves<T[K]>>
        : K;
    }[keyof T]
  : never;

export type TranslationKey = Leaves<Dict>;

function lookup(key: TranslationKey): string {
  const parts = key.split(".");
  let current: unknown = sq;

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : key;
}

export function t(
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const template = lookup(key);
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] === undefined ? `{${name}}` : String(vars[name]),
  );
}

export { sq };
