import Link from "next/link";
import { documentationLabels, transparencyForPath } from "@/lib/transparency";
import { sourceSummary } from "@/lib/source-summary";

// Intent: a beginner can inspect one missing field, while a technical reader
// can follow its source trail. Existing ink/paper semantic tokens, Manrope/Inter,
// quiet borders and a 4px rhythm keep documentation in the reading flow.
export function TransparencyProfile({ href }: { href: string }) {
  const fields = transparencyForPath(href);
  if (!fields.length) return null;
  return (
    <details className="transparency-profile reader-disclosure">
      <summary>
        <span>
          Transparency Profile
          <small>Recorded documentation and review status · No score</small>
        </span>
      </summary>
      <div className="reader-disclosure-body">
        <p>
          These states describe our documentation, not a product’s effectiveness
          or safety. A registered source is not a human verification. Extracted
          data remain pending a human check unless that check is recorded for
          this field and document version.
        </p>
        <dl className="documentation-fields">
          {fields.map((field) => (
            <div key={field.label} data-documentation-state={field.state}>
              <dt>{field.label}</dt>
              <dd>
                <strong>{documentationLabels[field.state]}</strong>
                <p>{field.detail}</p>
                {field.checkedAt && (
                  <small>
                    Source consultation / observation:{" "}
                    <time dateTime={field.checkedAt}>{field.checkedAt}</time>
                  </small>
                )}
                {field.verification && (
                  <small>
                    Field checked {field.verification.checkedAt} · Scope:{" "}
                    {field.verification.scope}
                  </small>
                )}
                {field.sourceIds.length > 0 && (
                  <div className="documentation-sources">
                    {field.sourceIds.map((id) => {
                      const source = sourceSummary(id)!;
                      return (
                        <div key={id}>
                          <Link href={`/sources/#source-${id}`}>
                            {source.label} · {source.kind}
                          </Link>
                          <small>{source.access}</small>
                        </div>
                      );
                    })}
                  </div>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <Link className="text-link" href="/methodology/#documentation-states">
          Read the documentation methodology →
        </Link>
      </div>
    </details>
  );
}
