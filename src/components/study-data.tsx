import { evidence, type CitationSet } from "@/lib/citations";
import { studyDataFor } from "@/lib/study-data";
import { Citations } from "./citations";

// Intent: optional technical depth, with the same warm surfaces and quiet borders
// as the reader. Keep samples and study models explicit instead of scoring them.
export function StudyData({
  citations,
  comparisonId,
}: {
  citations: CitationSet;
  comparisonId: string;
}) {
  if (!studyDataFor(comparisonId).length) return null;
  return (
    <details className="reader-disclosure study-data" id="study-data">
      <summary>
        <span>
          Study data
          <small>
            Design, sample, duration and what each source can tell us
          </small>
        </span>
        <span className="reader-plus" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="reader-disclosure-body">
        <p>
          For a closer look at the research behind this review. These sources
          answer different questions: they are not head-to-head tests of the two
          retail serums. Their results cannot be combined into a product
          ranking.
        </p>
        <p className="study-scroll-hint">
          On smaller screens, scroll the table sideways. Open a numbered
          reference for access limits, funding context and source details.
        </p>
        <div
          className="study-table-scroll"
          role="region"
          aria-label="Study data table, scroll horizontally"
          tabIndex={0}
        >
          <table className="study-table">
            <caption>
              Studies and safety assessments behind this comparison
            </caption>
            <thead>
              <tr>
                <th scope="col">Source & design</th>
                <th scope="col">Sample or model</th>
                <th scope="col">Duration</th>
                <th scope="col">Reported finding</th>
                <th scope="col">How to interpret it</th>
              </tr>
            </thead>
            <tbody>
              {studyDataFor(comparisonId).map((row) => {
                const note = evidence.find(
                  (item) => item.sourceId === row.sourceId,
                )!;
                return (
                  <tr key={row.sourceId}>
                    <th scope="row">
                      <strong>{note.kind}</strong>
                      <span>{note.year}</span>
                      <Citations
                        set={citations}
                        claim={`study-data-${row.sourceId}`}
                      />
                    </th>
                    <td>{row.sample}</td>
                    <td>{row.duration}</td>
                    <td>{note.finding ?? note.supports}</td>
                    <td>{row.scope}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p>
          Reading limit: some records were checked through abstracts or
          repository summaries, not full papers. See each reference for exactly
          what was inspected. Scientific review remains pending.
        </p>
      </div>
    </details>
  );
}
