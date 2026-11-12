import { comparisonPath } from "./config";
import type { TopicId } from "./topic-registry";

export type NavigationTopic = { id: TopicId; href: string; title: string; description: string };
export const globalLinks = [
  { title: "Peptides A–Z", href: "/peptides/" },
  { title: "Compare", href: comparisonPath() },
  { title: "Learn", href: "/learn/" },
  { title: "Search", href: "/search/" },
];
export function topicForPath(path: string, topics: readonly NavigationTopic[]) {
  const topic = topics.find(
    (candidate) =>
      path === candidate.href.slice(0, -1) || path.startsWith(candidate.href),
  );
  if (topic) return topic;
  if (/^\/library\/(bpc-157|retatrutide)(?:\/|$)/.test(path))
    return topics.find((candidate) => candidate.id === "health");
  return undefined;
}
export const skinLinks = [
  { title: "Overview", href: "/skincare/" },
  { title: "Products", href: "/skincare/products/" },
  { title: "Comparisons", href: comparisonPath() },
  { title: "Ingredients", href: "/skincare/ingredients/" },
  { title: "Guides", href: "/skincare/guides/" },
];
