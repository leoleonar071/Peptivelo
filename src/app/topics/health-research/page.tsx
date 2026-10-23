import Link from "next/link";
import { TopicLanding } from "@/components/topic-landing";
import { contentNavigation } from "@/lib/content-navigation";
import { activeTopicBySlug } from "@/lib/topic-registry";
export const metadata = {
  title: "Health & research",
  description: "Selected peptide research briefs and their evidence limits.",
  alternates: { canonical: "/topics/health-research/" },
  robots: { index: false, follow: true },
};
export default function ResearchPage() {
  return (
    <TopicLanding
      topic={activeTopicBySlug("health-research")!}
      entries={contentNavigation}
      heading="Explore the research. Understand its limits."
      introduction="Selected educational briefs on retatrutide and BPC-157. These editorial drafts are not a comprehensive research review. Human editorial and scientific review remain pending."
    >
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
    </TopicLanding>
  );
}
