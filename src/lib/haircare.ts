import { z } from "zod";
import raw from "@/data/haircare.json";
import { catalog } from "./data";
import { citationSet } from "./citations";

export const haircare = z
  .object({
    product: z.object({
      id: z.string(),
      slug: z.string(),
      brand: z.string(),
      name: z.string(),
      volumeMl: z.number().positive(),
      priceUsd: z.number().nonnegative(),
      checkedAt: z.iso.date(),
      image: z.string().startsWith("/images/products/"),
      sourceId: z.string(),
      status: z.literal("draft"),
    }),
    ingredients: z
      .array(
        z.object({
          slug: z.string(),
          name: z.string(),
          summary: z.string(),
          identity: z.string(),
          identitySourceIds: z.array(z.string()).min(1),
          evidence: z.string(),
          evidenceSourceIds: z.array(z.string()).min(1),
          support: z.string(),
          limit: z.string(),
        }),
      )
      .min(1),
  })
  .parse(raw);
const ids = [
  haircare.product.sourceId,
  ...haircare.ingredients.flatMap((i) => [
    ...i.identitySourceIds,
    ...i.evidenceSourceIds,
  ]),
];
if (
  ids.some((id) => !catalog.sources.some((s) => s.id === id)) ||
  new Set(haircare.ingredients.map((i) => i.slug)).size !==
    haircare.ingredients.length
)
  throw new Error("Invalid haircare source or identity");
export const hairProductPath = `/haircare/products/${haircare.product.slug}/`;
export const hairIngredientPath = (slug: string) =>
  `/haircare/ingredients/${slug}/`;
export function hairProductCitations() {
  return citationSet("haircare", [
    ...["label", "price", "directions"].map((key) => ({
      key,
      sourceIds: [haircare.product.sourceId],
    })),
    ...haircare.ingredients.map((i) => ({
      key: `ingredient-${i.slug}`,
      sourceIds: i.identitySourceIds,
    })),
    { key: "research", sourceIds: ["hair-combination-trial"] },
  ]);
}
export function hairIngredientCitations(
  i: (typeof haircare.ingredients)[number],
) {
  return citationSet("hair-ingredient", [
    { key: "identity", sourceIds: i.identitySourceIds },
    { key: "evidence", sourceIds: i.evidenceSourceIds },
  ]);
}
