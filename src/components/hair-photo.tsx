import Image from "next/image";
import { haircare } from "@/lib/haircare";

// Intent: recognize the scalp product and its size before reading claims.
// Same contained manufacturer photography, warm paper surface and border-only
// depth as skincare; no decorative treatment or image-based quality signal.
export function HairPhoto({ priority = false }: { priority?: boolean }) {
  const p = haircare.product;
  return (
    <div className="hair-photo">
      <Image
        src={p.image}
        width={800}
        height={800}
        alt={`${p.brand} ${p.name}, ${p.volumeMl} mL — manufacturer product photograph`}
        unoptimized
        priority={priority}
      />
    </div>
  );
}
