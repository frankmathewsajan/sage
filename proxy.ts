import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/signup", "/api/health"];

function isPublicPath(pathname: string) {
  return publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isPublicAsset(pathname: string) {
  // Allow any asset-like request (files with an extension) and Next static/runtime assets
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  return /\.[^/]+$/.test(pathname);
}

export const config = {
  matcher: ["/:path*"],
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public pages and static assets without auth
  if (isPublicPath(pathname) || isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get("sage-auth"));
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
