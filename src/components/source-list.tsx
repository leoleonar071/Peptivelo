import "server-only";
import { ArrowUpRight } from "lucide-react";
import { catalog } from "@/lib/data";
import { sourceSummary } from "@/lib/source-summary";

export function SourceList({
  ids,
  anchors = false,
}: {
  ids: string[];
  anchors?: boolean;
}) {
  return (
    <div className="source-list">
      {catalog.sources
        .filter((s) => ids.includes(s.id))
        .map((s) => (
          <div key={s.id} id={anchors ? `source-${s.id}` : undefined}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title} <ArrowUpRight size={14} />
            </a>
            <small>
              {sourceSummary(s.id)?.kind} · {sourceSummary(s.id)?.access}
            </small>
            {anchors && (
              <details>
                <summary>Evidence scope and disclosures</summary>
                <dl>
                  <dt>What it supports</dt>
                  <dd>{sourceSummary(s.id)?.supports}</dd>
                  <dt>Limits</dt>
                  <dd>{sourceSummary(s.id)?.limits}</dd>
                  <dt>Funding and commercial context</dt>
                  <dd>{sourceSummary(s.id)?.commercialContext}</dd>
                </dl>
              </details>
            )}
            <small>
              {s.publisher} ·{" "}
              {s.sourceType === "manufacturer"
                ? "Manufacturer / supplier information"
                : s.sourceType === "research"
                  ? "Research / ingredient reference"
                  : "Public health guidance"}{" "}
              · Accessed {s.accessedAt}
            </small>
          </div>
        ))}
    </div>
  );
}
