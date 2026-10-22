import Image from "next/image";

// Use the supplied artwork intact. Text is the site name, not a redrawn logo.
export function BrandIdentity({ name, priority = false }: { name: string; priority?: boolean }) {
  return <><span className="brand-mark"><Image src="/brand/peptivelo-isotype-header.webp" unoptimized width={44} height={40} sizes="44px" alt="" priority={priority} /></span><span className="brand-wordmark">{name}</span></>;
}
