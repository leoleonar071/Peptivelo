import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandIdentity } from "@/components/brand-identity";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/config";
import { Navigation } from "@/components/navigation";
import "./globals.css";
import "./brand-typography.css";
import "../styles/peptivelo-tokens.css";
import "../styles/peptivelo-components.css";
import "../styles/home-hero.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Understand peptides. Compare with confidence.`,
    template: `%s | ${site.name}`,
  },
  description:
    "Compare peptide skincare labels, check sources, and calculate prices per mL with transparent tools.",
  robots: { index: site.indexable, follow: true },
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  icons: { icon: [{ url: "/brand/peptivelo-isotype.png", type: "image/png" }] },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" data-theme="light" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: 'try{document.documentElement.dataset.theme=localStorage.getItem("pv-theme")==="dark"?"dark":"light"}catch{}' }} /></head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="utility">
          <span>THE SKINCARE EDITION</span>
          <span>Clearer information. More informed choices.</span>
          <Link href="/editorial-policy/">
            Independent by design <ArrowUpRight size={12} />
          </Link>
        </div>
        <header className="header">
          <Link className="brand" href="/">
            <BrandIdentity name={site.name} priority />
            <span className="beta">BETA</span>
          </Link>
          <ThemeToggle />
          <Navigation />
        </header>
        <main id="main">{children}</main>
        <footer>
          <div className="footer-top">
            <div>
              <Link href="/" className="brand">
                <BrandIdentity name={site.name} />
              </Link>
              <p>
                Better questions. Clearer comparisons.
                <br />A more considered approach to peptide skincare.
              </p>
            </div>
            <div>
              <span className="eyebrow">EXPLORE</span>
              <Link href="/skincare/">Skincare atlas</Link>
              <Link href="/library/">Peptide library</Link>
              <Link href="/haircare/">Hair & scalp</Link>
              <Link href="/skincare/products/">Products</Link>
              <Link href="/skincare/identify/">Know your serum</Link>
              <Link href="/skincare/choose/">Choose by your question</Link>
              <Link href="/skincare/ingredients/">Ingredients</Link>
              <Link href="/skincare/guides/">Label guides</Link>
              <Link href="/tools/price-per-ml/">Price calculator</Link>
            </div>
            <div>
              <span className="eyebrow">OUR STANDARDS</span>
              <Link href="/methodology/">Methodology</Link>
              <Link href="/editorial-policy/">Editorial policy</Link>
              <Link href="/sources/">Sources</Link>
              <Link href="/affiliate-disclosure/">Affiliate disclosure</Link>
            </div>
            <div>
              <span className="eyebrow">{site.name}</span>
              <Link href="/about/">About</Link>
              <Link href="/contact/">Contact</Link>
              <Link href="/privacy/">Privacy policy</Link>
              <Link href="/terms/">Terms</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © 2026 {site.name}. Cosmetic information, thoughtfully organized.
            </span>
            <span>Educational information. Not medical advice.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
