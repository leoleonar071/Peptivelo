import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { publicationDocuments, canIndexPath } from "@/lib/publication-registry";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicationDocuments
    .filter((document) => canIndexPath(document.href))
    .map((document) => ({
      url: new URL(document.href, site.url).href,
      ...(document.checkedAt ? { lastModified: document.checkedAt } : {}),
    }));
}
