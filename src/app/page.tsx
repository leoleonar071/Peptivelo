import { comparisonPath } from "@/lib/config";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { TopicCards, ContentCards } from "@/components/discovery";
import { contentNavigation } from "@/lib/content-navigation";
import { site } from "@/lib/config";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  const featured = [
    contentNavigation.find((e) => e.id === "library:retatrutide")!,
    contentNavigation.find(
      (e) => e.href === "/skincare/guides/peptide-percentages-explained/",
    )!,
    contentNavigation.find(
      (e) => e.href === comparisonPath("niod-cais3-vs-the-ordinary"),
    )!,
    contentNavigation.find((e) => e.id === "hair:product")!,
  ];
  return (
    <div className="discovery-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: site.name,
                url: site.url,
                logo: `${site.url}/brand/peptivelo-isotype.png`,
              },
              { "@type": "WebSite", name: site.name, url: site.url },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <HomeHero />
      <section
        className="wrap discovery-section"
        aria-labelledby="topics-title"
      >
        <span className="eyebrow">FIND YOUR STARTING POINT</span>
        <h2 id="topics-title">Explore by topic</h2>
        <p>Choose an area to see its products, explanations and research.</p>
        <TopicCards headingLevel={3} />
        <Link className="text-link" href="/topics/">
          All topics →
        </Link>
      </section>
      <section className="wrap discovery-section">
        <div className="discovery-intro-panel">
          <span className="eyebrow">START WITH THE BASICS</span>
          <h2>New to peptides?</h2>
          <p>
            A cosmetic label, a medicine and an experimental compound need
            different kinds of evidence. Understand the differences before going
            deeper.
          </p>
          <Link className="button" href="/library/peptide-categories/">
            Start here →
          </Link>
          <Link className="text-link" href="/learn/">
            Explore all learning guides →
          </Link>
        </div>
      </section>
      <section
        className="wrap discovery-section"
        aria-labelledby="featured-title"
      >
        <span className="eyebrow">SELECTED READING</span>
        <h2 id="featured-title">Featured content</h2>
        <p>
          Explore different topics and formats. Review status is shown on each
          selection.
        </p>
        <ContentCards entries={featured} headingLevel={3} />
      </section>
      <section className="wrap discovery-section">
        <div className="discovery-intro-panel">
          <span className="eyebrow">CLEAR SOURCES. VISIBLE LIMITS.</span>
          <h2>How we work</h2>
          <p>
            We distinguish label facts, ingredient research and product
            evidence. Missing information and pending reviews stay visible.
          </p>
          <div className="button-row">
            <Link className="button" href="/methodology/">
              Our methodology
            </Link>
            <Link className="text-link" href="/sources/">
              Explore our sources →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
