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
    categories: "Kategori",
    viewAll: "Shiko të gjitha {name}",
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
    body: "Zgjidhni nga vitamina, minerale dhe produkte fitness të certifikuara. Katalogu i plotë vjen së shpejti.",
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
