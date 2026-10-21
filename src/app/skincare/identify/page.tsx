import { ProductIdentify } from "@/components/product-identify";

export const metadata = {
  title: "Know your serum",
  description:
    "Find your peptide serum, confirm the label and understand the evidence one ingredient at a time.",
  alternates: { canonical: "/skincare/identify/" },
  robots: { index: false, follow: true },
};

export default function IdentifyPage() {
  return <ProductIdentify />;
}
