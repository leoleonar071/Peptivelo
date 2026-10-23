import type { ContentEntry } from "./content-navigation";
import { isActiveTopic, type TopicId } from "./topic-registry";

// Planning metadata must not become an entry in a public listing by accident.
export const isPublicTopicEntry = (entry: ContentEntry) =>
  entry.topic === null || isActiveTopic(entry.topic);
export function entriesForTopic(
  entries: readonly ContentEntry[],
  topic: TopicId,
) {
  if (!isActiveTopic(topic)) return [];
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (!isPublicTopicEntry(entry) || seen.has(entry.id)) return false;
    if (entry.topic !== topic && !entry.additionalTopics?.includes(topic))
      return false;
    seen.add(entry.id);
    return true;
  });
}
