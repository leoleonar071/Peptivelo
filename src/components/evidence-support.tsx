import { evidence } from "@/lib/citations";
import { supportLabels } from "@/lib/reading-context";

// Quiet text identifies the source, without colored scores or quality badges.
export function EvidenceSupport({ ids, interpretation = false }: { ids: string[]; interpretation?: boolean }) {
  if (interpretation) return <p className="evidence-support">Editorial interpretation</p>;
  const labels = [...new Set(ids.map((id) => evidence.find((e) => e.sourceId === id)?.kind).filter((kind) => kind !== undefined).map((kind) => supportLabels[kind] ?? kind))];
  return <p className="evidence-support">{labels.length ? `Source type: ${labels.join(" · ")}` : "Editorial interpretation"}</p>;
}
