import { PeptideDirectory } from "@/components/peptide-directory";
import { topics } from "@/lib/site-navigation";
import { contentNavigation } from "@/lib/content-navigation";
import { canIndexPath } from "@/lib/publication-registry";
export const metadata = {
  title: "Peptides A–Z",
  description:
    "Browse existing peptide ingredient profiles and selected research briefs by topic.",
  alternates: { canonical: "/peptides/" },
  robots: { index: canIndexPath("/peptides/"), follow: true },
};
export default async function PeptidesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const entries = contentNavigation
    .filter((e) => e.directory)
    .sort((a, b) => a.title.localeCompare(b.title, "en"));
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">PEPTIDES A–Z</span>
      <h1>Find a peptide or ingredient.</h1>
      <p>
        Browse by name, topic or reading format. Context-specific profiles stay
        separate, with their review status visible.
      </p>
      <PeptideDirectory
        entries={entries}
        topics={topics.map(({ id, href, title, description }) => ({ id, href, title, description }))}
        topic={typeof params.topic === "string" ? params.topic : "all"}
        format={typeof params.format === "string" ? params.format : "all"}
        qname={
          typeof params.qname === "string" ? params.qname.slice(0, 200) : ""
        }
      />
    </div>
  );
}
