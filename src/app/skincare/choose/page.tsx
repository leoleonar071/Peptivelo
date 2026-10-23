import { comparisonPath } from "@/lib/config";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { catalog } from "@/lib/data";

export const metadata = {
  title: "Find a starting point for your serum comparison",
  description: "Explore peptide serum comparisons by your buying question, with evidence limits made clear.",
  alternates: { canonical: "/skincare/choose/" },
  robots: { index: false, follow: true },
};

const paths = [
  {
    title: "Expression lines",
    intro: "Understand a focused peptide label versus a multi-peptide formula.",
    guideId: "argireline-vs-ha",
    reason: "Start with The Ordinary Argireline and Multi-Peptide + HA to inspect the selected ingredient names, label claims and recorded prices.",
    limit: "A targeted ingredient name does not prove a stronger result. This comparison does not establish which finished serum reduces lines more.",
    question: "Does the research test this exact serum, or an ingredient in another formula?",
  },
  {
    title: "Hydration and formula basics",
    intro: "Make sense of two formulas before paying for extra complexity.",
    guideId: "matrixyl-vs-ha",
    reason: "Explore The Ordinary Matrixyl and Multi-Peptide + HA. Read the formula explanations and compare what each label actually discloses.",
    limit: "This is a route into formula information, not a clinically verified hydration ranking. More peptide names do not establish better hydration.",
    question: "Which differences are documented, and which benefits have not been compared directly?",
  },
  {
    title: "Is the higher price worth it?",
    intro: "Separate a premium price from evidence of a better result.",
    guideId: "ptiox-vs-ha",
    reason: "Explore SkinCeuticals P-TIOX and The Ordinary Multi-Peptide + HA, including recorded price per mL, selected ingredients and formula-level studies.",
    limit: "The available studies do not establish a head-to-head clinical winner. Check the regional label limitation and study funding before drawing a conclusion.",
    question: "What evidence supports the extra cost for the outcome I care about?",
  },
];

export default function ChoosePage() {
  // A shopper arrives with a buying question: reveal one source-linked route,
  // its purpose and its limits together, using the existing quiet notebook surface.
  return (
    <main className="wrap section choose-page">
      <Link className="text-link" href="/">← Home</Link>
      <span className="eyebrow">A CLEARER STARTING POINT</span>
      <h1>What are you looking for?</h1>
      <p className="choose-intro">Choose a question. Explore one comparison at a time.</p>
      <p className="choose-scope">These are reading paths, not personalized product recommendations. Editorial drafts · Scientific review pending.</p>
      <div className="choose-paths">
        {paths.map((path) => {
          const guide = catalog.comparisons.find((item) => item.id === path.guideId)!;
          return (
            <details name="buying-question" className="choose-path" key={path.guideId}>
              <summary><span><strong>{path.title}</strong><span>{path.intro}</span></span><span className="choose-plus" aria-hidden="true">+</span></summary>
              <div className="choose-answer">
                <h2>A comparison to explore</h2>
                <p>{path.reason}</p>
                <div className="choose-limit"><strong>What this cannot tell you</strong><p>{path.limit}</p></div>
                <p><strong>Keep this question in mind:</strong> {path.question}</p>
                <Link className="button" href={comparisonPath(guide.slug)}>Explore this comparison <ArrowRight size={16} /></Link>
                <p className="choose-source-note">Label facts, research citations and their limits are inside the comparison.</p>
              </div>
            </details>
          );
        })}
      </div>
      <div className="choose-other">
        <p>Already have a bottle? <Link href="/skincare/identify/">Understand your label →</Link></p>
        <p>Looking for fuller-looking hair? <Link href="/haircare/">Explore hair & scalp →</Link></p>
        <Link className="text-link" href={comparisonPath()}>Choose your own two products <ArrowRight size={16} /></Link>
      </div>
    </main>
  );
}
