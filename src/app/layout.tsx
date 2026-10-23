import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandIdentity } from "@/components/brand-identity";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/config";
import { Navigation } from "@/components/navigation";
import { footerGroups } from "@/lib/site-navigation";
import { SectionNavigation } from "@/components/section-navigation";
import "./globals.css";
import "./brand-typography.css";
import "../styles/peptivelo-tokens.css";
import "../styles/peptivelo-components.css";
import "../styles/home-hero.css";
import "../styles/product-offers.css";
import "../styles/home-editorial.css";
import "../styles/discovery.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Understand peptides. Compare with confidence.`,
    template: `%s | ${site.name}`,
  },
  description:
    "Explore peptides, ingredients, products and research with clear explanations and traceable sources.",
  robots: { index: site.indexable, follow: true },
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  icons: {
    icon: [
      {
        url: "/brand/peptivelo-isotype-icon.png",
        type: "image/png",
        sizes: "64x64",
      },
    ],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{document.documentElement.dataset.theme=localStorage.getItem("pv-theme")==="dark"?"dark":"light"}catch{}',
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="utility">
          <span>EXPLORE THE WORLD OF PEPTIDES</span>
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
        <main id="main">
          <SectionNavigation />
          {children}
        </main>
        <footer>
          <div className="footer-top">
            <div>
              <Link href="/" className="brand">
                <BrandIdentity name={site.name} />
              </Link>
              <p>
                Better questions. Clearer comparisons.
                <br />
                Explore peptides, products and evidence.
              </p>
            </div>
            {footerGroups.map((group) => (
              <div key={group.title}>
                <span className="eyebrow">{group.title}</span>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>
              © 2026 {site.name}. Peptide knowledge, thoughtfully organized.
            </span>
            <span>Educational information. Not medical advice.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
