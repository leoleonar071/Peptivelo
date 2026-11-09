import type { ContentEntry } from "./content-navigation";
import { ingredientAliases } from "./search";
import { catalog } from "./data";
const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export function matchesDirectoryName(entry: ContentEntry, query: string) {
  const needle = normalize(query.slice(0, 200));
  if (!needle) return true;
  const ingredient = catalog.ingredients.find(
    (item) => `skin:${item.id}` === entry.id,
  );
  const names = [
    entry.title,
    ...(ingredient
      ? [ingredient.inciName, ...(ingredientAliases[ingredient.id] ?? [])]
      : []),
  ];
  return names.some((name) => normalize(name).includes(needle));
}
