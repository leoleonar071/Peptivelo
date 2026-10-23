import type {
  Exploration,
  ExplorationProduct,
  ExplorationState,
  QueryParams,
} from "./exploration";
import { canCompareEntities } from "./comparison-groups";

export function compatible(a: ExplorationProduct, b: ExplorationProduct) {
  return canCompareEntities(
    { id: a.id, kind: "product", topic: a.context },
    { id: b.id, kind: "product", topic: b.context },
  );
}
export function explorationUrl(
  state: ExplorationState,
  changes: Partial<ExplorationState> = {},
) {
  const next = { ...state, ...changes };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next))
    if (value !== "") params.set(key, String(value));
  return `/search/?${params}`;
}

export function sortedAlternatives(
  model: Exploration,
  state: ExplorationState,
) {
  return model.products
    .filter((p) => p.group === state.group)
    .sort((a, b) => {
      if (state.sort !== "related") {
        if (a.perMl === null && b.perMl !== null) return 1;
        if (a.perMl !== null && b.perMl === null) return -1;
        if (a.perMl !== null && b.perMl !== null && a.perMl !== b.perMl)
          return state.sort === "low" ? a.perMl - b.perMl : b.perMl - a.perMl;
      }
      return b.shared - a.shared || a.name.localeCompare(b.name, "en");
    });
}

export function explorationState(
  params: QueryParams,
  model: Exploration,
): ExplorationState {
  const group =
    (queryValue(params, "group") === "other" ||
      !model.products.some((p) => p.group === "same")) &&
    model.products.some((p) => p.group === "other")
      ? "other"
      : "same";
  const requested = queryValue(params, "tab");
  const tab =
    requested === "evidence"
      ? "evidence"
      : model.canCompare &&
          (requested === "compare" ||
            (!["overview", "compare", "evidence"].includes(requested) &&
              model.kind === "product"))
        ? "compare"
        : "overview";
  const sort =
    queryValue(params, "sort") === "low"
      ? "low"
      : queryValue(params, "sort") === "high"
        ? "high"
        : "related";
  const a =
    model.reference ??
    model.products.find((p) => p.id === queryValue(params, "a"));
  const b =
    a &&
    model.products.find(
      (p) => p.id === queryValue(params, "b") && compatible(a, p),
    );
  const size = tab === "evidence" ? 3 : 4;
  const count =
    tab === "evidence"
      ? model.evidence.length
      : model.products.filter((p) => p.group === group).length;
  const rawPage = Number(queryValue(params, "page"));
  const page = Math.min(
    Math.max(1, Number.isSafeInteger(rawPage) ? rawPage : 1),
    Math.max(1, Math.ceil(count / size)),
  );
  return {
    q: queryValue(params, "q").slice(0, 200),
    entity: model.id,
    tab,
    group,
    sort,
    page,
    a: a?.id ?? "",
    b: b?.id ?? "",
  };
}

function queryValue(params: QueryParams, key: string) {
  return typeof params[key] === "string" ? (params[key] as string) : "";
}
