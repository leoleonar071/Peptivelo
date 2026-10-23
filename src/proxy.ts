import { NextResponse, type NextRequest } from "next/server";
import { site, comparisonPath } from "@/lib/config";
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  if (
    !site.indexable ||
    req.nextUrl.search ||
    req.nextUrl.pathname.replace(/\/$/, "") === comparisonPath().replace(/\/$/, "")
  )
    res.headers.set("X-Robots-Tag", "noindex, follow");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
