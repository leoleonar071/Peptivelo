import Link from "next/link";
import { globalLinks } from "@/lib/site-navigation";
export const metadata = {
  title: "Peptide library",
  description: "Find your way to peptide topics, profiles and learning guides.",
  alternates: { canonical: "/library/" },
  robots: { index: false, follow: true },
};
export default function LibraryPage() {
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">PEPTIDE LIBRARY</span>
      <h1>A clearer way to explore Peptivelo.</h1>
      <p>
        The library’s articles are still available. Choose a topic, find a
        peptide or start with a learning guide.
      </p>
      <div className="discovery-grid">
        {[
          {
            title: "Explore topics",
            href: "/topics/",
            description: "Browse skin, hair and selected health research.",
          },
          ...globalLinks
            .filter((l) => l.href !== "/search/")
            .map((l) => ({
              ...l,
              description:
                l.href === "/learn/"
                  ? "Understand peptide basics and cosmetic labels."
                  : "Find ingredient profiles and research briefs alphabetically.",
            })),
        ].map((l) => (
          <Link className="discovery-card" key={l.href} href={l.href}>
            <h2>{l.title}</h2>
            <p>{l.description}</p>
            <span className="text-link">Explore →</span>
          </Link>
        ))}
      </div>
      <Link className="text-link" href="/library/peptide-categories/">
        New to peptides? Start here →
      </Link>
    </div>
  );
}
