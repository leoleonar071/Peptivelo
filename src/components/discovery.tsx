import Link from "next/link";
import { topics } from "@/lib/site-navigation";
import { type ContentEntry } from "@/lib/content-navigation";
import { isPublicTopicEntry } from "@/lib/content-topics";
export function TopicCards({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="discovery-grid">
      {topics.map((t) => (
        <Link className="discovery-card" key={t.id} href={t.href}>
          <span className="eyebrow">Explore topic</span>
          <Heading>{t.title}</Heading>
          <p>{t.description}</p>
          <span className="text-link">Explore this topic →</span>
        </Link>
      ))}
    </div>
  );
}
export function ContentCards({
  entries,
  headingLevel = 2,
}: {
  entries: ContentEntry[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="discovery-grid content-grid">
      {entries.filter(isPublicTopicEntry).map((e) => (
        <Link className="discovery-card" href={e.href} key={e.id}>
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
