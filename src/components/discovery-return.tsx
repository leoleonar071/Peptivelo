import Link from "next/link";
import {
  discoveryReturn,
  productReturn,
  withDiscoveryReturn,
} from "@/lib/discovery-context";

export function DiscoveryReturn({
  value,
  fromProduct,
}: {
  value?: string;
  fromProduct?: string;
}) {
  const href = discoveryReturn(value);
  const product = productReturn(fromProduct);
  return (
    <div className="discovery-return-links">
      {product && (
        <Link
          className="text-link discovery-return"
          href={withDiscoveryReturn(product, href)}
        >
          ← Back to product
        </Link>
      )}
      {href ? (
        <Link className="text-link discovery-return" href={href}>
          ← Back to your{" "}
          {href.startsWith("/peptides/") ? "directory" : "exploration"}
        </Link>
      ) : null}
    </div>
  );
}
