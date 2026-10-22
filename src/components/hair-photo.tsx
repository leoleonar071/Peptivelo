import Image from "next/image";
import { haircare } from "@/lib/haircare";

// Owned text record identifies the exact scalp product without borrowed photos.
export function HairPhoto({ priority = false }: { priority?: boolean }) {
  const p = haircare.product;
  return (
    <div className="hair-photo">
      <Image
        src={p.image}
        width={800}
        height={800}
        alt={`${p.brand} ${p.name}, ${p.volumeMl} mL — product record, not a packaging photograph`}
        unoptimized
        priority={priority}
      />
    </div>
  );
}
