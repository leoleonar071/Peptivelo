import "@/styles/product-identifier.css";
import { isVisiblePath } from "@/lib/publication-registry";
import { ProductIdentify } from "@/components/product-identify";

export const metadata = {
  title: "Identify your serum — search products and ingredients",
  description:
    "Find a documented skincare serum by name, brand or ingredient. Scan compatible Peptivelo QR codes and explore label information, sources and evidence limits.",
  alternates: { canonical: "/skincare/identify/" },
  robots: { index: false, follow: true },
};

export default function IdentifyPage() {
  return <ProductIdentify showHaircare={isVisiblePath("/haircare/")} />;
}
