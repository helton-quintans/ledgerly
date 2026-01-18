import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];
const STATIC_PATH_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/robots",
  "/sitemap",
  "/opengraph-image",
];

function isPublicRoute(pathname: string) {
  if (pathname === "/") {
    return false;
  }

  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function isStaticAsset(pathname: string) {
  return STATIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isStaticAsset(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set(
        "callbackUrl",
        `${pathname}${req.nextUrl.search}`,
      );
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|manifest.json).*)",
  ],
};
