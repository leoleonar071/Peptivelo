import { ResearchDocumentation } from "@/components/research-documentation";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { previewAuthorized } from "@/lib/editorial-preview-auth";
import { isVisiblePath } from "@/lib/publication-registry";
import { peptideLinks, peptideForSlug } from "@/lib/peptides";
import { PeptideProfile } from "@/components/peptide-profile";
import { IngredientProfileEducation } from "@/components/ingredient-profile-education";
import { catalog } from "@/lib/data";
import { libraryArticles } from "@/lib/library";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private editorial preview",
  robots: { index: false, follow: false, noarchive: true },
};
export default async function Preview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!previewAuthorized((await headers()).get("authorization"))) notFound();
  const p = peptideForSlug((await params).slug);
  if (!p) notFound();
  const links = peptideLinks(p);
  const existing = p.existingDocumentId?.startsWith("skin:")
    ? catalog.ingredients.find((i) => `skin:${i.id}` === p.existingDocumentId)
    : undefined;
  const brief = libraryArticles.find(
    (a) => `library:${a.slug}` === p.existingDocumentId,
  );
  return (
    <>
      <div className="wrap library-page">
        <h1>Private editorial workspace: {p.name}</h1>
        <p>
          Preview only · No publication or scientific approval. Canonical:{" "}
          {p.canonicalPath}
        </p>
        {existing && (
          <section aria-label="Existing canonical content">
            <h2>Existing canonical content — unchanged</h2>
            <IngredientProfileEducation ingredient={existing} />
          </section>
        )}
        {brief && (
          <section aria-label="Existing brief">
            <h2>Existing brief — unchanged</h2>
            <p>{brief.answer}</p>
            {brief.sections.map((s) => (
              <section key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </section>
            ))}
          </section>
        )}
        {p.existingDocumentId && (
          <ResearchDocumentation documentId={p.existingDocumentId} />
        )}
        <h2>Staged editable sections</h2>
        <p>
          Edit src/data/peptides/{p.slug}.json and refresh. This does not
          replace existing canonical content.
        </p>
      </div>
      <PeptideProfile
        peptide={p}
        links={{
          products: links.products.filter(({ href }) => isVisiblePath(href)),
          comparisons: links.comparisons.filter(({ href }) =>
            isVisiblePath(href),
          ),
          related: links.peptides.filter(({ href }) => isVisiblePath(href)),
        }}
      />
      <details className="wrap">
        <summary>All editable fields (read only)</summary>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {JSON.stringify(p, null, 2)}
        </pre>
      </details>
    </>
  );
}
