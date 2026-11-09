import { catalog } from "./data";
import { evidence } from "./citations";

export function sourceSummary(id: string) {
  const source = catalog.sources.find((item) => item.id === id);
  if (!source) return undefined;
  const note = evidence.find((item) => item.sourceId === id);
  const author = note?.authors?.split(",")[0];
  const citation = author
    ? `${author}${note!.authors!.includes(",") ? " et al." : ""}${note?.year ? `, ${note.year}` : ""}`
    : source.publisher;
  return {
    title: source.title,
    label: citation,
    kind:
      note?.kind ??
      (source.sourceType === "manufacturer"
        ? "Manufacturer source"
        : source.sourceType === "regulator"
          ? "Regulatory source"
          : "Research reference"),
    access: note?.access ?? "Source registered; access scope not extracted.",
    checkedAt: note?.checkedAt ?? source.accessedAt,
    commercialContext:
      note?.commercialContext ?? "Commercial context has not been extracted.",
    supports:
      note?.supports ??
      "A source is registered; detailed support has not been extracted.",
    limits: note?.limits ?? "Evidence scope has not been appraised.",
  };
}
