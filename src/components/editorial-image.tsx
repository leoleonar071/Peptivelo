import type { EditorialImage as ImageRecord } from "@/lib/peptide-schema";

export function EditorialImage({ image }: { image?: ImageRecord }) {
  if (!image?.optimizedFile || image.approval !== "approved") return null;
  return (
    <figure className="peptide-image">
      {/* A local, licensed asset only; no remote image download or placeholder. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.optimizedFile} alt={image.alt} width={720} height={480} />
      <figcaption>
        {image.credit} · <a href={image.originalUrl}>{image.originalSource}</a>{" "}
        · {image.license}
        {image.attributionRequired && <> · {image.attribution}</>}
        {image.aiChanges.trim() && <> · {image.aiChanges}</>}
      </figcaption>
    </figure>
  );
}
