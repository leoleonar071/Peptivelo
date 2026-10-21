export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Peptivelo",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  indexable: process.env.SITE_INDEXABLE === "true",
  contact: process.env.CONTACT_EMAIL?.trim() || undefined,
  operator: process.env.SITE_OPERATOR_NAME?.trim() || undefined,
  hostingProvider: process.env.HOSTING_PROVIDER?.trim() || undefined,
};
export const date = "2026-10-18";
export const productPath = (slug: string) => `/skincare/products/${slug}/`;
export const ingredientPath = (slug: string) =>
  `/skincare/ingredients/${slug}/`;
