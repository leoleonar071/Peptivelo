import Link from "next/link";
import { documentForPath } from "@/lib/publication-registry";
import { knowledgeRelations } from "@/lib/knowledge-relations";
import { withProductContext } from "@/lib/discovery-context";

export function KnowledgeNextSteps({
  href,
  returnTo,
  fromProduct,
}: {
  href: string;
  returnTo?: string;
  fromProduct?: string;
}) {
  const document = documentForPath(href);
  if (!document) return null;
  const related = knowledgeRelations(href).slice(0, 4);
  return (
    <nav className="knowledge-next-steps" aria-label="Keep exploring">
      <h2>Keep exploring</h2>
      <ul className="knowledge-related-list">
        {related.map((entry) => (
          <li key={entry.href}>
            <Link
              className="text-link"
              href={withProductContext(
                entry.href,
                document.id.startsWith("product:") ||
                  document.id === "hair:product"
                  ? href
                  : fromProduct,
                returnTo,
              )}
            >
              {entry.title} →
            </Link>
            <p>{entry.reason}</p>
          </li>
        ))}
      </ul>
      <div className="button-row">
        <Link className="text-link" href="/peptides/">
          Peptides A–Z →
        </Link>
        <Link className="text-link" href="/methodology/">
          How to read our sources →
        </Link>
      </div>
    </nav>
  );
}
