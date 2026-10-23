import Link from "next/link";
import type { ReactNode } from "react";
import { ContentCards } from "./discovery";
import type { ContentEntry } from "@/lib/content-navigation";
import { entriesForTopic } from "@/lib/content-topics";
import {
  activeTopics,
  relatedActiveTopics,
  type ActiveTopic,
} from "@/lib/topic-registry";

const sections = [
  { title: "Peptides & ingredients", formats: ["Ingredient profile"] },
  { title: "Products", formats: ["Product profile"] },
  { title: "Research & articles", formats: ["Research brief"] },
  { title: "Guides", formats: ["Guide"] },
  { title: "Comparisons", formats: ["Comparison"] },
] as const;

// A shared landing for populated areas. Missing blocks are omitted, not placeholders.
export function TopicLanding({
  topic,
  entries,
  heading = topic.title,
  introduction = topic.description,
  children,
}: {
  topic: ActiveTopic;
  entries: readonly ContentEntry[];
  heading?: string;
  introduction?: string;
  children?: ReactNode;
}) {
  const content = entriesForTopic(entries, topic.id);
  const subtopics = activeTopics.filter(
    (candidate) => "parentId" in candidate && candidate.parentId === topic.id,
  );
  const related = relatedActiveTopics(topic);
  return (
    <div className="wrap discovery-page">
      <span className="eyebrow">{topic.title.toUpperCase()}</span>
      <h1>{heading}</h1>
      <p>{introduction}</p>
      {subtopics.length > 0 && (
        <section aria-label="Subtopics">
          <h2>Explore this topic</h2>
          <div className="discovery-grid">
            {subtopics.map((subtopic) => (
              <Link
                className="discovery-card"
                key={subtopic.id}
                href={subtopic.href}
              >
                <h3>{subtopic.title}</h3>
                <p>{subtopic.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      {sections.map((section) => {
        const items = content.filter((entry) =>
          (section.formats as readonly string[]).includes(entry.format),
        );
        return items.length > 0 ? (
          <section
            className="discovery-section"
            key={section.title}
            aria-label={section.title}
          >
            <h2>{section.title}</h2>
            <ContentCards entries={items} headingLevel={3} />
          </section>
        ) : null;
      })}
      {children}
      {related.length > 0 && (
        <section className="discovery-section" aria-label="Related topics">
          <h2>Related topics</h2>
          <div className="button-row">
            {related.map((other) => (
              <Link className="text-link" href={other.href} key={other.id}>
                {other.title} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
