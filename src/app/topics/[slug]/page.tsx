import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { activeTopicBySlug } from "@/lib/topic-registry";
import { contentNavigation } from "@/lib/content-navigation";
import { entriesForTopic } from "@/lib/content-topics";
import { TopicLanding } from "@/components/topic-landing";

type Props = { params: Promise<{ slug: string }> };
function availableTopic(slug: string) {
  const topic = activeTopicBySlug(slug);
  // Do not create aliases for bespoke skin/hair hubs, or serve empty planned pages.
  return topic?.href === `/topics/${slug}/` &&
    entriesForTopic(contentNavigation, topic.id).length
    ? topic
    : undefined;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = availableTopic((await params).slug);
  return topic
    ? {
        title: topic.title,
        description: topic.description,
        alternates: { canonical: topic.href },
        robots: { index: false, follow: true },
      }
    : { title: "Page not found", robots: { index: false, follow: false } };
}
export default async function TopicPage({ params }: Props) {
  const topic = availableTopic((await params).slug);
  if (!topic) notFound();
  return <TopicLanding topic={topic} entries={contentNavigation} />;
}
