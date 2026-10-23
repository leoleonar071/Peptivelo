import { expect, it } from "vitest";
import { products, catalog } from "../src/lib/data";
import {
  getExploration,
  resolveExploration,
  explorationState,
  sortedAlternatives,
} from "../src/lib/exploration";
import { compatible, explorationUrl } from "../src/lib/exploration-navigation";
import { searchDestination } from "../src/lib/search";
import { searchIndex } from "../src/lib/search-index";

it("resolves exact identities but leaves partial, question and unknown queries for search", () => {
  for (const q of ["GHK-Cu", "ghkcu", "Copper Tripeptide-1"])
    expect(resolveExploration({ q })?.id).toBe(
      "skin:ingredient:copper-tripeptide-1",
    );
  for (const q of [
    "What is GHK-Cu?",
    "Copper",
    "coper peptides",
    "unknown",
    "",
  ])
    expect(resolveExploration({ q })).toBeNull();
  expect(resolveExploration({ q: "GHK-Cu", entity: "invalid" })).toBeNull();
  expect(resolveExploration({ q: ["GHK-Cu", "Retatrutide"] })).toBeNull();
  expect(resolveExploration({ q: "BPC-157" })?.context).toBe("health");
});

it("preserves exact ingredient identity, separates editorial alternatives and excludes reference", () => {
  const model = getExploration("skin:ingredient:copper-tripeptide-1")!;
  expect(
    model.products
      .filter((p) => p.group === "same")
      .map((p) => p.id)
      .sort(),
  ).toEqual(["cosrx-six-mini", "ordinary-copper"].sort());
  const niod = model.products.find((p) => p.id === "niod-cais3")!;
  expect(niod.group).toBe("other");
  expect(niod.reason).toContain("editorial draft");
  expect(new Set(model.products.map((p) => p.id)).size).toBe(
    model.products.length,
  );
  const reference = getExploration("skin:product:ordinary-copper")!;
  expect(reference.products.some((p) => p.id === "ordinary-copper")).toBe(
    false,
  );
  for (const alt of reference.products.filter((p) => p.group === "other"))
    expect(
      catalog.comparisons.some(
        (c) =>
          c.comparedProductIds.includes("ordinary-copper") &&
          c.comparedProductIds.includes(alt.id),
      ),
    ).toBe(true);
});

it("keeps missing prices last in either price direction", () => {
  const model = getExploration("skin:ingredient:copper-tripeptide-1")!;
  for (const sort of ["low", "high"] as const) {
    const sorted = sortedAlternatives(model, {
      ...explorationState({}, model),
      sort,
    });
    expect(sorted.at(-1)?.price).toBeNull();
    expect(sorted[0].perMl).not.toBeNull();
  }
});

it("only offers the existing facial-serum comparator for compatible pairs", () => {
  const hair = getExploration("hair:ingredient:biotinoyl-tripeptide-1")!;
  expect(hair.products).toHaveLength(1);
  expect(hair.canCompare).toBe(false);
  expect(getExploration("hair:product")?.canCompare).toBe(false);
  const research = getExploration("health:bpc-157")!;
  expect(research.canCompare).toBe(false);
  expect(research.products).toEqual([]);
  expect(research.evidence.length).toBeGreaterThan(0);
  const skin = getExploration("skin:product:ordinary-copper")!;
  expect(compatible(skin.reference!, hair.products[0])).toBe(false);
  expect(compatible(skin.reference!, skin.reference!)).toBe(false);
});

it("validates selection, pagination and tabs, locking product reference", () => {
  const model = getExploration("skin:product:ordinary-copper")!;
  const state = explorationState(
    {
      tab: "nonsense",
      group: "bad",
      sort: "bad",
      page: "Infinity",
      a: "niod-cais3",
      b: "ordinary-copper",
    },
    model,
  );
  expect(state).toMatchObject({
    tab: "compare",
    group: "same",
    sort: "related",
    page: 1,
    a: "ordinary-copper",
    b: "",
  });
  expect(
    explorationState(
      { a: "unknown", b: "niod-cais3", page: "999999" },
      getExploration("skin:ingredient:copper-tripeptide-1")!,
    ),
  ).toMatchObject({ a: "", b: "", page: 1 });
  expect(
    explorationState({ tab: "compare" }, getExploration("health:retatrutide")!)
      .tab,
  ).toBe("overview");
});

it("maintains explicit search routing without moving article destinations", () => {
  const ingredient = searchIndex.find(
    (e) => e.entity?.id === "skin:ingredient:copper-tripeptide-1",
  )!;
  expect(searchDestination(ingredient, "GHK-Cu")).toContain(
    "entity=skin%3Aingredient%3Acopper-tripeptide-1",
  );
  const article = searchIndex.find((e) => e.href === "/library/bpc-157/")!;
  expect(searchDestination(article, "BPC-157")).toBe(article.href);
  const state = explorationState(
    { q: "GHK-Cu", a: "ordinary-copper", b: "cosrx-six-mini" },
    getExploration(ingredient.entity!.id)!,
  );
  const params = Object.fromEntries(
    new URL(explorationUrl(state), "https://example.test").searchParams,
  );
  expect(
    explorationState(params, getExploration(ingredient.entity!.id)!),
  ).toEqual(state);
});

it("every published skin product can enter a view with source-backed context", () => {
  for (const product of products) {
    const model = getExploration(`skin:product:${product.id}`)!;
    expect(model.reference?.id).toBe(product.id);
    expect(model.blocks[0].sources.length).toBeGreaterThan(0);
    for (const p of model.products)
      expect(compatible(model.reference!, p)).toBe(true);
  }
});
