import "server-only";
import { globalLinks, topicForPath as findTopic } from "./navigation-links";
export { globalLinks, skinLinks } from "./navigation-links";
import { activeTopics } from "./topic-registry";
export type { TopicId } from "./topic-registry";
import { isVisiblePath } from "./publication-registry";
export const topics = activeTopics.filter((topic) => isVisiblePath(topic.href));
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
export const topicForPath = (path: string) => findTopic(path, topics);
