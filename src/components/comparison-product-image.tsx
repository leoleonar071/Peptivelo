"use client";
import Image from "next/image";
import { useState } from "react";
import { brandName, type Product } from "@/lib/data";
import { volumeLabel } from "@/lib/comparison";
export function ComparisonProductImage({ product: p }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="v2-product-image">
      {failed ? (
        <span
          className="v2-image-fallback"
          role="img"
          aria-label={`Product record: ${brandName(p)} ${p.name}, ${volumeLabel(p)}; not a packaging photograph`}
        >
          <span>{brandName(p)}</span>
          <strong>Label record</strong>
          <small>{volumeLabel(p)}</small>
        </span>
      ) : (
        <Image
          src={p.image}
          alt={`${brandName(p)} ${p.name}, ${volumeLabel(p)} — product record, not a packaging photograph`}
          width={160}
          height={160}
          unoptimized
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
