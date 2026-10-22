import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Columns3,
  Calculator,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { products } from "@/lib/data";
import { site } from "@/lib/config";
import { ProductCard, SectionHeading } from "@/components/ui";
import { HomeHero } from "@/components/home-hero";
import { LearningGuides } from "@/components/learning-guides";
export const metadata = { alternates: { canonical: "/" } };
const starterComparison = "/skincare/compare/?a=ordinary-copper&b=niod-cais3";

export default function Home() {
  return (
    <div className="home-editorial">
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
      <section className="catalog-section" id="products">
        <div className="wrap section">
          <SectionHeading
            kicker="THE STARTER COLLECTION"
            title="Choose a product. Look closer."
            href="/skincare/products/"
            label="Explore the catalog"
          />
          <p className="section-intro">
            Explore {products.length} documented US label profiles. Prices are
            dated observations, not live offers.
          </p>
          <div className="home-product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="catalog-next-step">
            <p>New to comparing peptide serums?</p>
            <Link className="button" href={starterComparison}>
              Try the starter comparison <ArrowRight size={18} />
            </Link>
          </div>
          <p className="photo-credit">
            Product records show documented names and sizes, not packaging
            photographs. Check the current package before buying.
          </p>
        </div>
      </section>
      <div className="wrap">
        <section className="section choose-home-entry">
          <span className="eyebrow">START WITH YOUR QUESTION</span>
          <h2>Less searching. A clearer starting point.</h2>
          <p>
            Expression lines, formula basics, or a higher price: explore the
            differences that matter to you.
          </p>
          <Link className="button" href="/skincare/choose/">
            Find a comparison to explore <ArrowRight size={18} />
          </Link>
        </section>
        <LearningGuides />
      </div>
      <section className="wrap section">
        <SectionHeading
          kicker="A LITTLE CONTEXT HELPS"
          title="Understand the details that matter."
        />
        <div className="question-grid">
          {[
            {
              icon: Columns3,
              title: "Compare the labels",
              text: "See the recorded differences and the limits of what we can conclude.",
              href: starterComparison,
              cta: "Open a comparison",
            },
            {
              icon: BookOpen,
              title: "Decode an ingredient",
              text: "Find exact ingredient names, their sources, and what remains unknown.",
              href: "/skincare/ingredients/",
              cta: "Explore ingredients",
            },
            {
              icon: Calculator,
              title: "Put price in perspective",
              text: "Enter your own prices and sizes to compare the cost per milliliter.",
              href: "/tools/price-per-ml/",
              cta: "Calculate price per mL",
            },
          ].map((x) => (
            <Link className="question-card" key={x.href} href={x.href}>
              <x.icon size={24} />
              <h3>{x.title}</h3>
              <p>{x.text}</p>
              <span className="text-link">
                {x.cta}
                <ArrowUpRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="methodology-brief">
        <div className="wrap">
          <ShieldCheck size={30} />
          <div>
            <span className="eyebrow">CLEAR SOURCES. VISIBLE LIMITS.</span>
            <h2>Know what you’re comparing.</h2>
            <p>
              We check manufacturer labels and show what’s missing. Label
              verification is not independent laboratory testing, and ingredient
              overlap does not establish equal results.
            </p>
          </div>
          <Link className="text-link" href="/methodology/">
            How we compare <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
