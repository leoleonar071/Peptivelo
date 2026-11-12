import { z } from "zod";
import { legacyEditorialStatus as status } from "./editorial-status";
import { editorialImageSchema } from "./peptide-schema";
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
  concentrationStatus: z.enum([
    "recorded-disclosure",
    "not-disclosed",
    "not-reviewed",
  ]),
  manufacturerStudyNote: z.string().optional(),
  concentrationExplanation: z.string(),
  sourceId: z.string(),
  lastVerifiedAt: z.iso.date(),
  editorialStatus: status,
  formulationNotes: z.string(),
  tone: z.string(),
  image: z.string().startsWith("/images/products/"),
  editorialImages: z.array(editorialImageSchema).optional(),
  usageSummary: z.string().optional(),
});
const explanation = z.object({
  text: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
});
export const catalogSchema = z
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
  });
export type Catalog = z.infer<typeof catalogSchema>;
export type EditorialComparison = Catalog["comparisons"][number];
export type Product = Catalog["products"][number];
export type Ingredient = Catalog["ingredients"][number];
