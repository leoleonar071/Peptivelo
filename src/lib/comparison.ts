import { brandName, priceFor, sourceFor, type Product } from "./data";
import { compareLabels, money, normalize } from "./math";
import { readingLimits } from "./reading-context";

export function costInsight(a: number | null, b: number | null) {
  if (a === null || b === null) return { kind: "missing" as const };
  if (a === b) return { kind: "equal" as const };
  const lower = a < b ? ("a" as const) : ("b" as const);
  // Percentage is relative to the more expensive product, so zero-price products are supported.
  return {
    kind: "different" as const,
    lower,
    percent: ((Math.max(a, b) - Math.min(a, b)) / Math.max(a, b)) * 100,
  };
}
export function comparisonFacts(a: Product, b: Product) {
  const observations = [priceFor(a), priceFor(b)] as const;
  const costs = observations.map((p) =>
    p ? normalize(p.price, p.size, p.sizeUnit) : null,
  );
  return {
    observations,
    costs,
    labels: compareLabels(a.ingredientList, b.ingredientList),
    cost: costInsight(costs[0]?.perMl ?? null, costs[1]?.perMl ?? null),
  };
}
export const volumeLabel = (p: Product) =>
  `${p.volume} ${p.volumeUnit === "ml" ? "mL" : "US fl oz"}`;

export type ComparisonValue = {
  sourceIds?: string[];
  text: string;
  note?: string;
  items?: string[];
  href?: string;
  date?: string;
  missing?: boolean;
  limitLabel?: string;
};

export const comparisonGroupsV2 = [
  "Product details",
  "Ingredients",
  "Pricing",
  "Brand claims",
  "Evidence",
] as const;
export function comparisonRowsV2(a: Product, b: Product): ComparisonRow[] {
  const facts = comparisonFacts(a, b);
  const pair = [a, b] as const;
  const rows = comparisonRows(a, b, true).map((row) => ({
    ...row,
    group: ["size", "format", "usage"].includes(row.id)
      ? "Product details"
      : row.id === "peptides"
        ? "Ingredients"
        : ["price", "unit-cost"].includes(row.id)
          ? "Pricing"
          : row.id === "concentrations"
            ? "Brand claims"
            : "Evidence",
    values: row.values.map((value, index) => ({
      ...value,
      ...(row.id === "concentrations"
        ? {
            text: pair[index].concentrationDisclosure,
            note: "Manufacturer disclosure, not an independent measurement. A blend percentage does not establish each ingredient’s concentration.",
          }
        : {}),
      sourceIds: [
        row.id === "price" || row.id === "unit-cost"
          ? (facts.observations[index]?.sourceId ?? pair[index].sourceId)
          : pair[index].sourceId,
      ],
      ...(row.id === "price" && facts.observations[index]
        ? { date: facts.observations[index]!.observedAt }
        : {}),
    })) as [ComparisonValue, ComparisonValue],
  }));
  const add = (
    id: string,
    group: string,
    label: string,
    render: (p: Product, index: number) => ComparisonValue,
    essential = true,
  ) =>
    rows.push({
      id,
      group,
      label,
      essential,
      different: true,
      values: [render(a, 0), render(b, 1)],
    });
  add("identity", "Product details", "Product", (p) => ({
    text: `${brandName(p)} ${p.name}`,
    href: `/skincare/products/${p.slug}/`,
  }));
  add(
    "market",
    "Product details",
    "Reference market",
    () => ({ text: "United States · USD" }),
    false,
  );
  add("label-date", "Product details", "Label checked", (p) => ({
    text: p.lastVerifiedAt,
    sourceIds: [p.sourceId],
  }));
  add("formula-scope", "Ingredients", "Ingredient-list coverage", (p) => ({
    text: p.ingredientListScope,
    note: "A missing name in this selection does not establish absence from the formula.",
    sourceIds: [p.sourceId],
  }));
  add("price-source", "Pricing", "Price source & update limits", (p, i) => ({
    text: facts.observations[i]
      ? "Recorded size-specific price"
      : "Price unavailable",
    missing: !facts.observations[i],
    sourceIds: [facts.observations[i]?.sourceId ?? p.sourceId],
    note: "Dated observation, not a live offer. Recheck prices older than 30 days before buying.",
  }));
  add("claims-coverage", "Brand claims", "Marketing-claim coverage", () => ({
    text: "Marketing claims are not separately structured in these catalog records.",
    missing: true,
    note: "Disclosed concentrations below are manufacturer information, not measured efficacy.",
  }));
  return rows.map((row) =>
    row.id === "market" ? { ...row, different: false } : row,
  );
}
export type ComparisonRow = {
  id: string;
  group: string;
  label: string;
  values: [ComparisonValue, ComparisonValue];
  different: boolean;
  essential?: boolean;
};

// Unknown values are never considered proof of equality. Limits and sources
// remain visible even when a shopper asks to hide matching recorded facts.
export function comparisonRows(
  a: Product,
  b: Product,
  clarifyLimits = false,
): ComparisonRow[] {
  const pair = [a, b] as const;
  const facts = comparisonFacts(a, b);
  const values = (
    render: (p: Product, i: number) => ComparisonValue,
  ): [ComparisonValue, ComparisonValue] => [render(a, 0), render(b, 1)];
  const names = (p: Product) =>
    [...new Set(p.ingredientList.map((name) => name.trim().toLowerCase()))]
      .sort()
      .join("|");
  return [
    {
      id: "size",
      group: "Product basics",
      label: "Presentation",
      different: a.volume !== b.volume || a.volumeUnit !== b.volumeUnit,
      values: values((p) => ({ text: volumeLabel(p) })),
    },
    {
      id: "format",
      group: "Product basics",
      label: "Format",
      different: a.category !== b.category,
      values: values((p) => ({ text: p.category })),
    },
    {
      id: "usage",
      group: "Product basics",
      label: "How the brand says to use it",
      different: a.usageSummary !== b.usageSummary,
      essential: true,
      values: values((p) => ({
        text:
          p.usageSummary ??
          "Directions not recorded. Read the manufacturer's current instructions.",
        missing: !p.usageSummary,
        note: "Manufacturer directions, not a personalized routine.",
      })),
    },
    {
      id: "price",
      group: "Price & value",
      label: "Recorded price",
      different: facts.observations[0]?.price !== facts.observations[1]?.price,
      essential: facts.observations.some((price) => !price),
      values: values((_, i) => {
        const price = facts.observations[i];
        return price
          ? {
              text: `${money(price.price)} USD`,
              note: "Excludes tax and shipping.",
              date: price.verifiedAt,
            }
          : {
              text: clarifyLimits ? readingLimits.price.label : "Not recorded",
              note: readingLimits.price.detail,
              missing: true,
            };
      }),
    },
    {
      id: "unit-cost",
      group: "Price & value",
      label: "Price per mL",
      different: facts.costs[0]?.perMl !== facts.costs[1]?.perMl,
      essential: facts.costs.some((cost) => !cost),
      values: values((_, i) =>
        facts.costs[i]
          ? { text: `${money(facts.costs[i]!.perMl)} / mL` }
          : {
              text: clarifyLimits ? readingLimits.price.label : "Not available",
              note: "Requires a verified price for this size.",
              missing: true,
            },
      ),
    },
    {
      id: "peptides",
      group: "What it contains and what it means",
      label: "Peptides, explained",
      different: names(a) !== names(b),
      values: values((p) => ({
        text: "",
        items: p.ingredientList,
        note: p.ingredientListScope,
      })),
    },
    {
      id: "concentrations",
      group: "What it contains and what it means",
      label: "How much of each ingredient?",
      different: a.concentrationDisclosure !== b.concentrationDisclosure,
      essential: true,
      values: values((p) => ({
        text: p.concentrationExplanation,
        limitLabel: clarifyLimits
          ? readingLimits.concentration.label
          : undefined,
        note: readingLimits.concentration.detail,
      })),
    },
    {
      id: "unknowns",
      group: "Sources & limits",
      label: "What we still cannot know",
      different: false,
      essential: true,
      values: values((_, i) => ({
        text: "Not established",
        missing: true,
        items: [
          ...(!facts.observations[i] ? ["Verified price for this size"] : []),
          "Complete ingredient list in this catalog",
          "Independent comparative effectiveness",
        ],
      })),
    },
    {
      id: "sources",
      group: "Sources & limits",
      label: "Label source",
      different: pair[0].sourceId !== pair[1].sourceId,
      essential: true,
      values: values((p) => ({
        text: `${brandName(p)} manufacturer label`,
        href: sourceFor(p).url,
        date: p.lastVerifiedAt,
        note: "Label checked; not a clinical review.",
      })),
    },
  ];
}

export function visibleComparisonRows(
  rows: ComparisonRow[],
  differencesOnly: boolean,
) {
  return differencesOnly
    ? rows.filter((row) => row.different || row.essential)
    : rows;
}
