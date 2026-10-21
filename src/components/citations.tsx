import Link from "next/link";
import { catalog } from "@/lib/data";
import {
  citationId,
  evidence,
  referenceId,
  type CitationSet,
} from "@/lib/citations";

// Existing DM Sans, ink/mineral tokens, quiet borders and 4px spacing preserve
// reading flow. Native links/details keep evidence usable without hydration.
export function Citations({ set, claim }: { set: CitationSet; claim: string }) {
  const ids = set.claims.find((c) => c.key === claim)?.sourceIds ?? [];
  return (
    <span className="inline-citations">
      {[...new Set(ids)].map((id) => {
        const source = catalog.sources.find((s) => s.id === id)!;
        const number = set.sourceIds.indexOf(id) + 1;
        return (
          <a
            key={id}
            id={citationId(set, claim, id)}
            href={`#${referenceId(set, id)}`}
            aria-label={`Reference ${number}: ${source.title}`}
          >
            [{number}]
          </a>
        );
      })}
    </span>
  );
}

export function EvidenceNotice() {
  return (
    <aside
      className="evidence-notice panel section"
      aria-label="How to read this evidence"
    >
      <strong>Follow the evidence, one claim at a time.</strong>
      <p>
        Numbered references show what supports each passage. Open a reference’s
        evidence notes to see what it establishes, its limits and any commercial
        context. Editorial interpretation and hypothetical arithmetic are
        labeled separately.
      </p>
      <p>
        Source checks are not scientific approval. Human editorial and qualified
        scientific review remain pending; no reviewer is attributed.
      </p>
      <div className="button-row">
        <Link href="/methodology/">How we evaluate sources</Link>
        <Link href="/contact/">Report a source or factual issue</Link>
      </div>
    </aside>
  );
}

export function References({ set }: { set: CitationSet }) {
  return (
    <ol className="numbered-references" aria-label="Numbered references">
      {set.sourceIds.map((id, index) => {
        const source = catalog.sources.find((s) => s.id === id)!;
        const note = evidence.find((e) => e.sourceId === id)!;
        return (
          <li key={id} id={referenceId(set, id)} value={index + 1} tabIndex={-1}>
            <span className="reference-kind">{note.kind}</span>
            {note.authors && (
              <p>
                {note.authors} {note.year}. {note.journal}.
              </p>
            )}
            <a
              className="reference-title"
              href={note.publicationUrl ?? source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {note.publicationTitle ?? source.title}
            </a>
            {note.doi && (
              <p>
                DOI:{" "}
                <a
                  href={`https://doi.org/${note.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {note.doi}
                </a>
              </p>
            )}
            <p className="reference-meta">
              {source.publisher} · Reference checked{" "}
              <time dateTime={note.checkedAt}>{note.checkedAt}</time>
            </p>
            <details>
              <summary>
                Evidence and limitations for reference {index + 1}
              </summary>
              <dl>
                {note.design && (
                  <>
                    <dt>What was studied</dt>
                    <dd>{note.design}</dd>
                  </>
                )}
                {note.finding && (
                  <>
                    <dt>What was reported</dt>
                    <dd>{note.finding}</dd>
                  </>
                )}
                <dt>What this supports here</dt>
                <dd>{note.supports}</dd>
                <dt>What it cannot establish</dt>
                <dd>{note.limits}</dd>
                <dt>Commercial context and disclosures</dt>
                <dd>{note.commercialContext}</dd>
                {note.contextUrl && (
                  <dd>
                    <a
                      href={note.contextUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source organization and funding context
                    </a>
                  </dd>
                )}
                <dt>What we inspected</dt>
                <dd>{note.access}</dd>
                {note.integrity && (
                  <>
                    <dt>Publication status check</dt>
                    <dd>{note.integrity}</dd>
                  </>
                )}
              </dl>
            </details>
            <div
              className="reference-returns"
              aria-label={`Return links for reference ${index + 1}`}
            >
              {set.claims
                .filter((c) => c.sourceIds.includes(id))
                .map((c, n) => (
                  <a
                    key={c.key}
                    href={`#${citationId(set, c.key, id)}`}
                    aria-label={`Return to citation ${index + 1}, occurrence ${n + 1}`}
                  >
                    ↩ {n + 1}
                  </a>
                ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
