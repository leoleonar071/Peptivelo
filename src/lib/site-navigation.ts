export const topics = [
  {
    id: "skin",
    title: "Skin & cosmetics",
    href: "/skincare/",
    description:
      "Explore serum labels, cosmetic ingredients and product comparisons.",
  },
  {
    id: "hair",
    title: "Hair & scalp",
    href: "/haircare/",
    description: "Understand scalp-serum labels and their peptide evidence.",
  },
  {
    id: "health",
    title: "Health & research",
    href: "/topics/health-research/",
    description: "Read selected research briefs and understand their limits.",
  },
] as const;
export type TopicId = (typeof topics)[number]["id"];
export const globalLinks = [
  { title: "Peptides A–Z", href: "/peptides/" },
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
  if (path.startsWith("/skincare")) return topics[0];
  if (path.startsWith("/haircare")) return topics[1];
  if (
    path.startsWith("/topics/health-research") ||
    /^\/library\/(bpc-157|retatrutide)(?:\/|$)/.test(path)
  )
    return topics[2];
  return undefined;
}
export const skinLinks = [
  { title: "Overview", href: "/skincare/" },
  { title: "Products", href: "/skincare/products/" },
  { title: "Comparisons", href: "/skincare/compare/" },
  { title: "Ingredients", href: "/skincare/ingredients/" },
  { title: "Guides", href: "/skincare/guides/" },
];
