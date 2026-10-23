import { comparisonPath } from "@/lib/config";
import { activeTopics } from "./topic-registry";
export type { TopicId } from "./topic-registry";
export const topics = activeTopics;
export const globalLinks = [
  { title: "Peptides A–Z", href: "/peptides/" },
  { title: "Compare", href: comparisonPath() },
  { title: "Learn", href: "/learn/" },
  { title: "Search", href: "/search/" },
];
export const footerGroups = [
  {
    title: "Explore",
    links: [
      { title: "All topics", href: "/topics/" },
      ...topics,
      ...globalLinks,
    ],
  },
  {
    title: "Our standards",
    links: [
      { title: "Methodology", href: "/methodology/" },
      { title: "Editorial policy", href: "/editorial-policy/" },
      { title: "Sources", href: "/sources/" },
      { title: "Affiliate disclosure", href: "/affiliate-disclosure/" },
    ],
  },
  {
    title: "About Peptivelo",
    links: [
      { title: "About", href: "/about/" },
      { title: "Contact", href: "/contact/" },
      { title: "Privacy policy", href: "/privacy/" },
      { title: "Terms", href: "/terms/" },
    ],
  },
];
export function topicForPath(path: string) {
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
