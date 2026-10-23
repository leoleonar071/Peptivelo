import { PeptideDirectory } from "@/components/peptide-directory";
import { contentNavigation } from "@/lib/content-navigation";
export const metadata = {
  title: "Peptides A–Z",
  description:
    "Browse existing peptide ingredient profiles and selected research briefs by topic.",
  alternates: { canonical: "/peptides/" },
  robots: { index: false, follow: true },
};
export default function PeptidesPage() {
  const entries = contentNavigation
    .filter((e) => e.directory)
    .sort((a, b) => a.title.localeCompare(b.title, "en"));
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">PEPTIDES A–Z</span>
      <h1>Find a peptide or ingredient.</h1>
      <p>
        Browse ingredient profiles and research briefs alphabetically. Each
        entry shows its topic, format and review status. Profiles in different
        contexts remain separate.
      </p>
      <PeptideDirectory entries={entries} />
    </div>
  );
}
