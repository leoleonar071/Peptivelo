import Link from "next/link";
import { researchRecords, studyExtractions } from "@/lib/research-records";
import { sourceSummary } from "@/lib/source-summary";

// Shared notebook surfaces and native disclosures keep the question, extraction
// and editorial interpretation separate, with optional detail for technical readers.
export function ResearchDocumentation({ documentId }: { documentId: string }) {
  const record = researchRecords.find((item) => item.documentId === documentId);
  if (!record) return null;
  const studies = studyExtractions.filter((item) =>
    record.sources.some((s) => s.sourceId === item.sourceId),
  );
  return (
    <section
      className="research-documentation"
      aria-label="Research selection and extraction"
    >
      <details className="reader-disclosure">
        <summary>How this evidence was selected</summary>
        <div className="reader-disclosure-body">
          <h2>Question and scope</h2>
          <p>{record.question}</p>
          <p>{record.selectionScope}</p>
          <h3>Recorded discovery searches</h3>
          {record.searches.map((search, index) => (
            <div key={index}>
              <p>
                <time dateTime={search.date}>{search.date}</time> ·{" "}
                {search.method}
              </p>
              <p className="research-query">{search.query}</p>
              <p>{search.limitation}</p>
            </div>
          ))}
          <h3>Why these sources are included</h3>
          <ul>
            {record.sources.map((item) => (
              <li key={item.sourceId}>
                <Link href={`/sources/#source-${item.sourceId}`}>
                  {sourceSummary(item.sourceId)!.label}
                </Link>{" "}
                · {item.state.replaceAll("-", " ")}
                <p>{item.reason}</p>
              </li>
            ))}
          </ul>
          {record.candidates.length > 0 && (
            <>
              <h3>Identified, not read or appraised</h3>
              <ul>
                {record.candidates.map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                    <p>{item.reason}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3>Coverage still pending</h3>
          <ul>
            {record.pending.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </details>
      {studies.map((study) => (
        <details className="reader-disclosure" key={study.sourceId}>
          <summary>
            Study extraction · {sourceSummary(study.sourceId)!.label}
          </summary>
          <div className="reader-disclosure-body">
            <p>
              Documentary extraction {study.extractedAt} · Human editorial and
              scientific review pending.
            </p>
            <dl className="study-extraction">
              {(
                [
                  ["Design", study.design],
                  ["Population", study.population],
                  ["Duration", study.duration],
                  ["What was measured", study.outcome],
                  ["Authors’ reported observation", study.reportedFinding],
                  ["Magnitude", study.magnitude],
                  ["Uncertainty and missing extraction", study.uncertainty],
                  ["Editorial interpretation and limits", study.interpretation],
                  ["Access inspected", study.access],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              className="text-link"
              href={`/sources/#source-${study.sourceId}`}
            >
              Read the source and its access notes →
            </Link>
          </div>
        </details>
      ))}
    </section>
  );
}
