// Plain-language limits describe missing information, never product quality.
export const readingLimits = {
  price: { label: "Price not verified", detail: "No verified price for this size." },
  concentration: { label: "Individual amounts not verified", detail: "Manufacturer disclosure; not independently measured." },
  preparation: { label: "Different study preparation", detail: "Not a test of either compared serum." },
} as const;

export const supportLabels: Record<string, string> = {
  "Manufacturer label": "Manufacturer label",
  "Supplier information": "Supplier information",
  "Human ingredient study": "Human ingredient study",
  "Human formulation study": "Human formula study",
  "Human clinical trial": "Human trial",
  "Human pilot study": "Human pilot study",
  "Laboratory study": "Laboratory study",
  "Human case report": "Case report",
  "Expert safety assessment": "Safety assessment",
  "Regulatory safety opinion": "Regulatory safety opinion",
  "Regulatory guidance": "Regulatory guidance",
  "Manufacturer study summary": "Brand-reported study",
};

export const usesReadingContext = (id: string) => Boolean(id);
