import Link from "next/link";
import type { ContentEntry } from "@/lib/content-navigation";
import type { NavigationTopic } from "@/lib/navigation-links";
import { withDiscoveryReturn } from "@/lib/discovery-context";

// Callers supply a public projection, filtered on the server.
export function ContentCards({
  entries,
  topics,
  headingLevel = 2,
  returnTo,
}: {
  entries: ContentEntry[];
  topics: NavigationTopic[];
  headingLevel?: 2 | 3;
  returnTo?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="discovery-grid content-grid">
      {entries.map((e) => (
        <Link
          className="discovery-card"
          href={withDiscoveryReturn(e.href, returnTo)}
          key={e.id}
        >
          <span className="eyebrow">
            {topics.find((t) => t.id === e.topic)?.title ?? "Peptide basics"} ·{" "}
            {e.format}
          </span>
          <Heading>{e.title}</Heading>
          <p>{e.description}</p>
          <span className="discovery-status">
            {e.status === "draft"
              ? "Editorial draft · Review pending"
              : e.status === "published"
                ? "Published"
                : e.status}
          </span>
          <span className="text-link">Read more →</span>
        </Link>
      ))}
    </div>
  );
}
