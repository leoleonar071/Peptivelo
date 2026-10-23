import { ContentCards } from "@/components/discovery";
import { contentNavigation } from "@/lib/content-navigation";
export const metadata = {
  title: "Learn about peptides",
  description:
    "Start with peptide basics and learn how to read cosmetic labels.",
  alternates: { canonical: "/learn/" },
  robots: { index: false, follow: true },
};
export default function LearnPage() {
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">LEARN</span>
      <h1>Build your understanding, one question at a time.</h1>
      <p>
        Start with the differences between peptide contexts, then explore
        practical guides to cosmetic labels.
      </p>
      <ContentCards entries={contentNavigation.filter((e) => e.learn)} />
    </div>
  );
}
