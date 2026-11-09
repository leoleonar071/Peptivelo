import { checkForField } from "./documentation-checks";
import { catalog, priceFor } from "./data";
import { documentForPath, policyForPath } from "./publication-registry";

export type DocumentationState =
  | "source-recorded"
  | "extracted"
  | "checked"
  | "not-disclosed"
  | "not-reviewed"
  | "not-applicable";
export type DocumentationField = {
  label: string;
  state: DocumentationState;
  detail: string;
  sourceIds: readonly string[];
  checkedAt?: string;
  verification?: { checkedAt: string; scope: string };
};
export const documentationLabels: Record<DocumentationState, string> = {
  "source-recorded": "Source registered",
  extracted: "Data extracted · Human check pending",
  checked: "Checked against the cited source",
  "not-disclosed": "Not disclosed in consulted sources",
  "not-reviewed": "Not reviewed",
  "not-applicable": "Not applicable",
};
export function transparencyForPath(href: string): DocumentationField[] {
  const document = documentForPath(href);
  const policy = policyForPath(href);
  if (!document || !policy) return [];
  const product = catalog.products.find(
    (p) => `product:${p.id}` === document.id,
  );
  const ingredient = catalog.ingredients.find(
    (i) => `skin:${i.id}` === document.id,
  );
  const fields: DocumentationField[] = [
    {
      label: "Source trail",
      state: document.sourceIds.length ? "source-recorded" : "not-reviewed",
      detail: document.sourceIds.length
        ? "References are recorded for this document. Their dates and access limits are shown individually; they are not independent product tests."
        : "A source trail has not been recorded for this page.",
      sourceIds: document.sourceIds,
    },
  ];
  if (product) {
    fields.push({
      label: "Product identity & ingredient coverage",
      state: "extracted",
      detail: `${product.name} · ${product.volume} ${product.volumeUnit === "ml" ? "mL" : "US fl oz"}. ${product.ingredientListScope}`,
      sourceIds: [product.sourceId],
      checkedAt: product.lastVerifiedAt,
    });
    fields.push({
      label: "Concentration disclosure",
      state:
        product.concentrationStatus === "recorded-disclosure"
          ? "extracted"
          : product.concentrationStatus,
      detail: product.concentrationDisclosure,
      sourceIds: [product.sourceId],
      checkedAt: product.lastVerifiedAt,
    });
    const price = priceFor(product);
    fields.push({
      label: "Finished-product research",
      state: "not-reviewed",
      detail:
        product.manufacturerStudyNote ??
        "Finished-product studies have not been appraised in this profile. This does not mean that no studies exist.",
      sourceIds: product.manufacturerStudyNote ? [product.sourceId] : [],
    });
    fields.push({
      label: "Price observation",
      state: price ? "extracted" : "not-reviewed",
      detail: price
        ? `${price.price} ${price.currency} for ${price.size} ${price.sizeUnit}. Dated US observation, excluding tax and shipping; current stock is not verified.`
        : "No unambiguous size-specific price observation is recorded.",
      sourceIds: price ? [price.sourceId] : [],
      checkedAt: price?.observedAt,
    });
  } else if (ingredient) {
    fields.push({
      label: "Recorded ingredient identity",
      state: "extracted",
      detail: `INCI: ${ingredient.inciName}. Context-specific profiles are kept separate.`,
      sourceIds: ingredient.education.whatItIs.sourceIds,
      checkedAt: ingredient.education.sourceCheckedAt,
    });
    fields.push({
      label: "Finished-product conclusions",
      state: "not-applicable",
      detail:
        "This is an ingredient profile. Ingredient evidence does not establish the results of a finished product.",
      sourceIds: [],
    });
  }
  fields.push({
    label: "Editorial review",
    state: policy.editorialReviewed ? "checked" : "not-reviewed",
    detail: policy.editorialReviewed
      ? "An editorial approval is recorded for this exact version."
      : "No current-version human editorial approval is recorded. Source checks and publication labels do not supply that approval.",
    sourceIds: [],
  });
  fields.push({
    label: "Scientific review",
    state: policy.scientificReviewed ? "checked" : "not-reviewed",
    detail: policy.scientificReviewed
      ? "A scientific approval is recorded for this exact version."
      : "No qualified scientific approval is recorded for this version. This profile does not establish efficacy, safety or clinical quality.",
    sourceIds: [],
  });
  return fields.map((field) => {
    if (["Editorial review", "Scientific review"].includes(field.label))
      return field;
    const check = checkForField(document, field.label);
    return check
      ? {
          ...field,
          state: "checked",
          verification: { checkedAt: check.checkedAt, scope: check.scope },
        }
      : field;
  });
}
