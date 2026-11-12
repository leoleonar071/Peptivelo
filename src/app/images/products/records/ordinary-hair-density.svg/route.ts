import { isVisiblePath } from "@/lib/publication-registry";
import { hairProductPath } from "@/lib/haircare";
import { scalpRecordImage } from "@/lib/scalp-record-image";

export const dynamic = "force-dynamic";

export function GET() {
  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (!isVisiblePath(hairProductPath))
    return new Response(null, { status: 404, headers });
  return new Response(scalpRecordImage, {
    headers: { ...headers, "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
