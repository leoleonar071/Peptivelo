import { NextResponse, type NextRequest } from "next/server";
import { site, comparisonPath } from "@/lib/config";
import { previewAuthorized } from "@/lib/editorial-preview-auth";
export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/editorial-preview")) {
    if (!previewAuthorized(req.headers.get("authorization")))
      return new NextResponse("Private editorial preview", {
        status: process.env.EDITORIAL_PREVIEW_ENABLED === "true" ? 401 : 404,
        headers: {
          "WWW-Authenticate": 'Basic realm="Peptivelo editorial"',
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      });
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }
  const res = NextResponse.next();
  if (
    !site.indexable ||
    req.nextUrl.search ||
    req.nextUrl.pathname.replace(/\/$/, "") ===
      comparisonPath().replace(/\/$/, "")
  )
    res.headers.set("X-Robots-Tag", "noindex, follow");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
