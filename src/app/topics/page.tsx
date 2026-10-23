import { TopicCards } from "@/components/discovery";
export const metadata = {
  title: "Explore peptide topics",
  description:
    "Find a starting point in skin, hair and selected health research.",
  alternates: { canonical: "/topics/" },
  robots: { index: false, follow: true },
};
export default function TopicsPage() {
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">EXPLORE PEPTIVELO</span>
      <h1>Explore topics</h1>
      <p>
        Start with an area of interest. Each topic brings its available
        explanations, products and evidence together.
      </p>
      <TopicCards />
    </div>
  );
}
