export const searchCategories = [
  "Peptides & ingredients",
  "Products",
  "Guides & articles",
  "Comparisons",
] as const;
export type SearchCategory = (typeof searchCategories)[number];
export type SearchEntry = {
  name: string;
  detail: string;
  terms: string;
  href: string;
  category: SearchCategory;
};
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
const stopwords = new Set(
  "a an the is are what which does do did it in on of for and or with contain contains mean actually how can to was were my".split(
    " ",
  ),
);
// Lexical retrieval only; never generates scientific answers.
export function searchEntries(
  entries: SearchEntry[],
  query: string,
): SearchEntry[] {
  const phrase = normalize(query).slice(0, 200);
  const tokens = [
    ...new Set(
      phrase.split(" ").filter((word) => word && !stopwords.has(word)),
    ),
  ];
  if (!tokens.length) return [];
  return entries
    .map((entry) => {
      const title = normalize(entry.name);
      const text = normalize(`${entry.name} ${entry.detail} ${entry.terms}`);
      const words = text.split(" ");
      const hits = tokens.filter((token) =>
        words.some((word) =>
          token.length < 3
            ? word === token
            : word.startsWith(token.replace(/s$/, "")),
        ),
      );
      const score =
        hits.length < Math.ceil(tokens.length / 2)
          ? 0
          : (title === phrase ? 100 : title.includes(phrase) ? 40 : 0) +
            hits.reduce(
              (sum, token) => sum + (title.includes(token) ? 10 : 2),
              0,
            ) +
            (hits.length === tokens.length ? 15 : 0);
      return { entry, score };
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
