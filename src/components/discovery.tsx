import "server-only";
import { ContentCards as Cards } from "./content-cards";
import Link from "next/link";
import { topics } from "@/lib/site-navigation";
import { type ContentEntry } from "@/lib/content-navigation";
import { isPublicTopicEntry } from "@/lib/content-topics";
const topicVisuals: Record<string, { file: string; alt: string }> = {
  skin: {
    file: "skin-barrier-concept",
    alt: "Schematic skin layers with a serum droplet above the surface.",
  },
  hair: {
    file: "hair-follicle-concept",
    alt: "Schematic hair follicle within layered scalp tissue.",
  },
  health: {
    file: "research-observation-concept",
    alt: "Research lens and source records, representing study and documentation.",
  },
};
export function TopicCards({
  headingLevel = 2,
  illustrated = false,
}: {
  headingLevel?: 2 | 3;
  illustrated?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className={`discovery-grid${illustrated ? " home-topic-grid" : ""}`}>
      {topics.map((t) => (
        <Link className="discovery-card" key={t.id} href={t.href}>
          {illustrated && topicVisuals[t.id] && (
            <div className="topic-art">
              <img
                src={`/images/editorial/${topicVisuals[t.id].file}.svg`}
                alt={topicVisuals[t.id].alt}
                width="640"
                height="360"
                loading="lazy"
                decoding="async"
              />
              <span>CONCEPTUAL ILLUSTRATION</span>
            </div>
          )}
          <span className="eyebrow">Explore topic</span>
          <Heading>{t.title}</Heading>
          <p>{t.description}</p>
          <span className="text-link">Explore this topic →</span>
        </Link>
      ))}
    </div>
  );
}
export function ContentCards(props: { entries: ContentEntry[]; headingLevel?: 2 | 3; returnTo?: string }) {
  return <Cards {...props} entries={props.entries.filter(isPublicTopicEntry)} topics={topics} />;
}
