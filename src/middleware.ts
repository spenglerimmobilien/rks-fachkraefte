import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/portal", "/arbeitgeber-portal"];
const adminPaths = ["/admin"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = adminPaths.some((p) => pathname.includes(p));
  const isProtectedPath = protectedPaths.some((p) => pathname.includes(p));

  if (isAdminPath || isProtectedPath) {
    const session = await auth();
    if (!session?.user) {
      const locale = pathname.split("/")[1] || "de";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdminPath && session.user.role !== "ADMIN") {
      const locale = pathname.split("/")[1] || "de";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    if (pathname.includes("/portal") && session.user.role !== "CANDIDATE" && session.user.role !== "ADMIN") {
      const locale = pathname.split("/")[1] || "de";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    if (pathname.includes("/arbeitgeber-portal") && session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
      const locale = pathname.split("/")[1] || "de";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
