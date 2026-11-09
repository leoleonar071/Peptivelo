import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeptideProfile } from "@/components/peptide-profile";
import { peptideForSlug, peptideLinks } from "@/lib/peptides";
import { canIndexPath, isVisiblePath } from "@/lib/publication-registry";
import { site } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };
function available(slug: string) {
  const p = peptideForSlug(slug);
  // Existing canonical URLs keep their current renderer. No duplicate alias.
  return p && !p.existingDocumentId && isVisiblePath(p.canonicalPath)
    ? p
    : undefined;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = available((await params).slug);
  if (!p)
    return { title: "Not found", robots: { index: false, follow: false } };
  const image = p.images.find((image) => image.approval === "approved");
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: p.canonicalPath },
    robots: { index: canIndexPath(p.canonicalPath), follow: true },
    openGraph: {
      title: p.seo.title,
      description: p.seo.description,
      url: p.canonicalPath,
      type: "article",
      modifiedTime: p.updatedAt ?? undefined,
      ...(image
        ? { images: [{ url: image.optimizedFile, alt: image.alt }] }
        : {}),
    },
  };
}
export default async function PeptidePage({ params }: Props) {
  const p = available((await params).slug);
  if (!p) notFound();
  const linked = peptideLinks(p);
  const publicOnly = <T extends { href: string }>(items: T[]) =>
    items.filter((item) => isVisiblePath(item.href));
  // Navigation markup only: no medical, efficacy, FAQ or product assertions.
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Peptides A–Z",
        item: new URL("/peptides/", site.url).href,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: p.name,
        item: new URL(p.canonicalPath, site.url).href,
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <PeptideProfile
        peptide={p}
        links={{
          products: publicOnly(linked.products),
          comparisons: publicOnly(linked.comparisons),
          related: publicOnly([
            ...linked.ingredients,
            ...linked.guides,
            ...linked.peptides,
          ]),
        }}
      />
    </>
  );
}
