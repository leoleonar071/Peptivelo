import { products } from "./data";
import type { TopicId } from "./site-navigation";

export type ComparisonEntity = {
  id: string;
  kind: "product" | "peptide";
  topic: TopicId;
};
export type ComparisonGroup = {
  id: string;
  kind: ComparisonEntity["kind"];
  topic: TopicId;
  eligibleIds: readonly string[];
  presentation: {
    label: string;
    renderer: "product-v2";
    market: "US";
    currency: "USD";
  };
};
// Eligibility is explicit catalog membership, never inferred from a name or claimed effect.
export const facialComparisonGroup: ComparisonGroup = {
  id: "facial-skincare",
  kind: "product",
  topic: "skin",
  eligibleIds: products.map((p) => p.id),
  presentation: {
    label: "facial skincare products",
    renderer: "product-v2",
    market: "US",
    currency: "USD",
  },
};
export const comparisonGroups: readonly ComparisonGroup[] = [
  facialComparisonGroup,
];
export function groupForEntity(entity: ComparisonEntity) {
  return comparisonGroups.find(
    (group) =>
      group.kind === entity.kind &&
      group.topic === entity.topic &&
      group.eligibleIds.includes(entity.id),
  );
}
export function canCompareEntities(a: ComparisonEntity, b: ComparisonEntity) {
  const group = groupForEntity(a);
  return a.id !== b.id && !!group && group === groupForEntity(b);
}
export const eligibleComparisonProducts = products.filter((p) =>
  groupForEntity({ id: p.id, kind: "product", topic: "skin" }),
);
export const canCompareProducts = (a: string, b: string) =>
  canCompareEntities(
    { id: a, kind: "product", topic: "skin" },
    { id: b, kind: "product", topic: "skin" },
  );
