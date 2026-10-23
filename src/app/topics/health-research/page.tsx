import Link from "next/link";
import { ContentCards } from "@/components/discovery";
import { contentNavigation } from "@/lib/content-navigation";
export const metadata = {
  title: "Health & research",
  description: "Selected peptide research briefs and their evidence limits.",
  alternates: { canonical: "/topics/health-research/" },
  robots: { index: false, follow: true },
};
export default function ResearchPage() {
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">HEALTH & RESEARCH</span>
      <h1>Explore the research. Understand its limits.</h1>
      <p>
        Selected educational briefs on retatrutide and BPC-157. These editorial
        drafts are not a comprehensive research review. Human editorial and
        scientific review remain pending.
      </p>
      <ContentCards
        entries={contentNavigation.filter((e) => e.topic === "health")}
      />
      <div className="discovery-intro-panel">
        <h2>Start with the right context</h2>
        <p>
          Understand the differences between cosmetics, medicines and
          experimental compounds.
        </p>
        <Link className="text-link" href="/library/peptide-categories/">
          Read the introduction →
        </Link>
      </div>
    </div>
  );
}
