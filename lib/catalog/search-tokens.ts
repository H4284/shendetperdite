const MIN_NGRAM = 3;

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function tokenizeSearchQuery(query: string): string | null {
  const [first] = normalize(query).split(/\s+/).filter(Boolean);
  return first ?? null;
}

export function buildSearchTokens(...parts: string[]): string[] {
  const tokens = new Set<string>();

  for (const part of parts) {
    const words = normalize(part).split(/\s+/).filter(Boolean);
    for (const word of words) {
      tokens.add(word);
      if (word.length <= MIN_NGRAM) continue;
      for (let size = MIN_NGRAM; size < word.length; size += 1) {
        tokens.add(word.slice(0, size));
      }
    }
  }

  return [...tokens];
}
