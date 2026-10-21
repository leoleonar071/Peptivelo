import { z } from "zod";
import raw from "@/data/catalog.json";
const status = z.enum(["draft", "published", "demo"]);
const source = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  url: z.url(),
  accessedAt: z.iso.date(),
  sourceType: z.enum(["manufacturer", "regulator", "research"]),
});
const product = z.object({
  id: z.string(),
  brandId: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  description: z.string(),
  volume: z.number().positive(),
  volumeUnit: z.enum(["ml", "oz"]),
  ingredientList: z.array(z.string()),
  ingredientListScope: z.string(),
  ingredientIds: z.array(z.string()),
  concentrationDisclosure: z.string(),
  concentrationExplanation: z.string(),
  sourceId: z.string(),
  lastVerifiedAt: z.iso.date(),
  editorialStatus: status,
  formulationNotes: z.string(),
  tone: z.string(),
  image: z.string().startsWith("/images/products/"),
  usageSummary: z.string().optional(),
});
const explanation = z.object({
  text: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
});
export const catalog = z
  .object({
    sources: z.array(source),
    brands: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        website: z.url(),
      }),
    ),
    ingredients: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        inciName: z.string(),
        slug: z.string(),
        ingredientCategory: z.string(),
        description: z.string(),
        knownLimitations: z.string(),
        education: z.object({
          summary: z.string().min(1),
          whatItIs: explanation,
          purpose: explanation,
          evidence: explanation.extend({
            label: z.enum([
              "Ingredient study",
              "Formulation study",
              "Supplier description",
              "Label information",
              "Safety assessment",
            ]),
          }),
          precautions: explanation,
          takeaway: z.string().min(1),
          sourceCheckedAt: z.iso.date(),
          scientificReviewPending: z.boolean().optional(),
        }),
        sourceIds: z.array(z.string()),
        status,
      }),
    ),
    products: z.array(product),
    retailers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        website: z.url(),
        affiliateUrl: z.url().nullable(),
        status: z.string(),
      }),
    ),
    prices: z.array(
      z.object({
        id: z.string(),
        productId: z.string(),
        retailerId: z.string(),
        currency: z.literal("USD"),
        price: z.number().nonnegative(),
        size: z.number().positive(),
        sizeUnit: z.enum(["ml", "oz"]),
        sourceId: z.string(),
        observedAt: z.iso.date(),
        verifiedAt: z.iso.date(),
        availabilityStatus: z.string(),
      }),
    ),
    comparisons: z.array(
      z.object({
        id: z.string(),
        slug: z.string(),
        title: z.string(),
        comparedProductIds: z.array(z.string()).length(2),
        editorialSummary: z.string(),
        citationPilot: z.boolean().optional(),
        researchContext: z
          .object({ text: z.string(), sourceIds: z.array(z.string()) })
          .optional(),
        documentedDifferences: z.string(),
        buyerQuestion: z.string().min(1),
        practicalDifferences: z
          .array(
            z.object({
              title: z.string().min(1),
              text: z.string().min(1),
              sourceIds: z.array(z.string()).optional(),
              interpretation: z.boolean().optional(),
            }),
          )
          .min(2),
        questions: z
          .array(
            z.object({
              question: z.string().min(1),
              answer: z.string().min(1),
              sourceIds: z.array(z.string()).min(1),
            }),
          )
          .min(2),
        decisionNotes: z
          .array(
            z.object({
              title: z.string(),
              text: z.string(),
              sourceIds: z.array(z.string()).optional(),
              interpretation: z.boolean().optional(),
            }),
          )
          .min(2),
        relatedGuideSlugs: z.array(z.string()).min(1),
        updatedAt: z.iso.date(),
        limitations: z.string(),
        sourceIds: z.array(z.string()),
        publicationStatus: status,
      }),
    ),
  })
  .parse(raw);
export type EditorialComparison = (typeof catalog.comparisons)[number];
for (const p of catalog.products) {
  if (
    !catalog.brands.some((b) => b.id === p.brandId) ||
    !catalog.sources.some((s) => s.id === p.sourceId) ||
    p.ingredientIds.some((id) => !catalog.ingredients.some((i) => i.id === id))
  )
    throw new Error(`Invalid references: ${p.id}`);
}
for (const group of [
  catalog.products,
  catalog.ingredients,
  catalog.sources,
  catalog.brands,
  catalog.retailers,
  catalog.prices,
  catalog.comparisons,
]) {
  if (new Set(group.map((record) => record.id)).size !== group.length)
    throw new Error("Duplicate catalog ID");
}
for (const ingredient of catalog.ingredients)
  if (
    [
      ...ingredient.sourceIds,
      ...[
        ingredient.education.whatItIs,
        ingredient.education.purpose,
        ingredient.education.evidence,
        ingredient.education.precautions,
      ].flatMap((section) => section.sourceIds),
    ].some((id) => !catalog.sources.some((s) => s.id === id))
  )
    throw new Error("Invalid ingredient source");
for (const p of catalog.prices)
  if (
    !catalog.products.some((x) => x.id === p.productId) ||
    !catalog.retailers.some((x) => x.id === p.retailerId) ||
    !catalog.sources.some((x) => x.id === p.sourceId)
  )
    throw new Error("Invalid price reference");
for (const c of catalog.comparisons)
  if (
    c.comparedProductIds.some(
      (id) => !catalog.products.some((p) => p.id === id),
    ) ||
    [
      ...c.sourceIds,
      ...c.questions.flatMap((q) => q.sourceIds),
      ...c.practicalDifferences.flatMap((n) => n.sourceIds ?? []),
      ...c.decisionNotes.flatMap((n) => n.sourceIds ?? []),
      ...(c.researchContext?.sourceIds ?? []),
    ].some((id) => !catalog.sources.some((s) => s.id === id))
  )
    throw new Error("Invalid comparison reference");
export type Product = z.infer<typeof product>;
export type Ingredient = (typeof catalog.ingredients)[number];
export const ingredientForName = (name: string) =>
  catalog.ingredients.find(
    (ingredient) =>
      ingredient.status === "published" &&
      ingredient.inciName.toLowerCase() === name.trim().toLowerCase(),
  );
export const products = catalog.products.filter(
  (p) => p.editorialStatus === "published",
);
export const brandName = (p: Product) =>
  catalog.brands.find((b) => b.id === p.brandId)!.name;
export const priceFor = (p: Product) =>
  catalog.prices
    .filter(
      (x) =>
        x.productId === p.id &&
        x.size === p.volume &&
        x.sizeUnit === p.volumeUnit,
    )
    .sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt))[0];
export const sourceFor = (p: Product) =>
  catalog.sources.find((s) => s.id === p.sourceId)!;
