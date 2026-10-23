export const searchCategories = [
  "Peptides & ingredients",
  "Products",
  "Guides & articles",
  "Comparisons",
  "Sources",
] as const;
export type SearchCategory = (typeof searchCategories)[number];
export type SearchEntry = {
  name: string;
  detail: string;
  terms: string;
  href: string;
  category: SearchCategory;
  entity?: { id: string; context: "skin" | "hair" | "health" };
  identity?: { id: string; name: string; aliases: string[] };
  relations?: { entityId: string; reason: string }[];
  matchReason?: string;
};
export function searchDestination(entry: SearchEntry, query: string) {
  return entry.entity && entry.category !== "Guides & articles"
    ? `/search/?${new URLSearchParams({ q: query.slice(0, 200), entity: entry.entity.id })}`
    : entry.href;
}
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
const stopwords = new Set(
  "a an the is are what which does do did it in on of for and or with contain contains mean actually how can to was were my please tell me about".split(
    " ",
  ),
);
const generic = new Set(
  "peptide serum product ingredient comparison compare concentration formula multi".split(
    " ",
  ),
);
const stem = (word: string) =>
  word.endsWith("ies") ? `${word.slice(0, -3)}y` : word.replace(/s$/, "");
const tokensFor = (text: string) => [
  ...new Set(
    normalize(text)
      .split(" ")
      .filter((word) => word && !stopwords.has(word))
      .map(stem),
  ),
];
const compact = (text: string) =>
  tokensFor(text)
    .filter((word) => !generic.has(word))
    .join("");
const commonTypos: Record<string, string> = {
  coper: "copper",
  peptde: "peptide",
};
function oneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length)
    return [...a].filter((letter, index) => letter !== b[index]).length === 1;
  const shorter = a.length < b.length ? a : b,
    longer = a.length < b.length ? b : a;
  for (let index = 0; index < longer.length; index++)
    if (longer.slice(0, index) + longer.slice(index + 1) === shorter)
      return true;
  return false;
}
function queryTokens(entries: SearchEntry[], query: string) {
  const tokens = tokensFor(query.slice(0, 200));
  const vocabulary = new Set(
    entries.flatMap((entry) =>
      tokensFor(`${entry.name} ${entry.detail} ${entry.terms}`),
    ),
  );
  const corrections: string[] = [];
  const resolved = tokens.map((token) => {
    // Scientific identifiers/numbers and ambiguous corrections stay untouched.
    if (vocabulary.has(token) || !/^[a-z]{5,20}$/.test(token)) return token;
    const known = Object.hasOwn(commonTypos, token)
      ? commonTypos[token]
      : undefined;
    if (known && vocabulary.has(known)) {
      corrections.push(`${token} → ${known}`);
      return known;
    }
    const candidates = [...vocabulary].filter(
      (word) => /^[a-z]{5,20}$/.test(word) && oneEdit(token, word),
    );
    if (candidates.length !== 1) return token;
    corrections.push(`${token} → ${candidates[0]}`);
    return candidates[0];
  });
  return { tokens: resolved, corrections };
}
// Lexical retrieval only; never generates scientific answers.
export function searchEntries(
  entries: SearchEntry[],
  query: string,
): SearchEntry[] {
  const { tokens, corrections } = queryTokens(entries, query);
  if (!tokens.length) return [];
  const phrase = tokens.join(" ");
  const identityQuery = compact(query.slice(0, 200));
  const identities = entries.flatMap((entry) =>
    entry.identity &&
    [entry.identity.name, ...entry.identity.aliases].some(
      (alias) => compact(alias) === identityQuery,
    )
      ? [entry.identity]
      : [],
  );
  const discriminants = tokens.filter((token) => !generic.has(token));
  const required = discriminants.length ? discriminants : tokens;
  return entries
    .map((entry) => {
      const title = normalize(entry.name);
      const words = tokensFor(`${entry.name} ${entry.detail} ${entry.terms}`);
      const matches = (token: string) =>
        words.some(
          (word) =>
            word === token || (token.length >= 3 && word.startsWith(token)),
        );
      const hits = tokens.filter((token) => matches(token));
      const direct = identities.find(
        (identity) => entry.identity?.id === identity.id,
      );
      const relation = entry.relations?.find((item) =>
        identities.some((identity) => identity.id === item.entityId),
      );
      // An identity query expands only through explicit relations, never shared words.
      const eligible = identities.length
        ? !!(direct || relation)
        : required.every(matches);
      const score = !eligible
        ? 0
        : (direct ? 1000 : relation ? 200 : 0) +
          (title === phrase ? 100 : title.includes(phrase) ? 40 : 0) +
          hits.reduce(
            (sum, token) => sum + (title.includes(token) ? 10 : 2),
            0,
          ) +
          (hits.length === tokens.length ? 15 : 0) +
          (/^(what|how|why)\b/i.test(query.trim()) &&
          entry.category === "Guides & articles"
            ? 25
            : 0);
      const reason = direct
        ? `Ingredient identity: ${direct.name}`
        : relation?.reason;
      return {
        entry: {
          ...entry,
          matchReason:
            [
              reason,
              corrections.length
                ? `Spelling suggestion: ${corrections.join(", ")}`
                : undefined,
            ]
              .filter(Boolean)
              .join(" · ") || undefined,
        },
        score,
      };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name),
    )
    .map(({ entry }) => entry);
}
export function groupedSuggestions(results: SearchEntry[], perCategory = 2) {
  const selected = new Set(
    searchCategories.flatMap((category) => {
      const first = results.find((entry) => entry.category === category);
      return first ? [first] : [];
    }),
  );
  for (const entry of results) {
    if (selected.size >= 7) break;
    if (
      [...selected].filter((item) => item.category === entry.category).length <
      perCategory
    )
      selected.add(entry);
  }
  return searchCategories.flatMap((category) =>
    results.filter(
      (entry) => selected.has(entry) && entry.category === category,
    ),
  );
}
