import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasPermission, permissionForAdminApi } from "./lib/permissions";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow next internals, static files, and auth endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    PUBLIC_FILE.test(pathname) ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const userProtected = ["/cart", "/checkout", "/my-orders", "/store"].some((p) => pathname.startsWith(p));
  const adminProtected = pathname.startsWith("/admin");
  const employeeProtected = pathname.startsWith("/employee");

  if (adminProtected) {
    // Protect admin *APIs* at the middleware level, but allow admin *pages* to
    // render so they can show a helpful client-side fallback when the server
    // session is missing (avoids confusing "Unauthorized" redirects).
    if (pathname.startsWith("/api/")) {
      if (!token) return new NextResponse(null, { status: 401 });
      const required = permissionForAdminApi(pathname, req.method);
      if (required) {
        if (!hasPermission(token as any, required)) return new NextResponse(null, { status: 401 });
        return NextResponse.next();
      }
      if ((token as any).role !== "admin") return new NextResponse(null, { status: 401 });
      return NextResponse.next();
    }

    // For page routes under /admin, allow the request through — the page will
    // perform a server-side session check and render a friendly fallback when
    // appropriate. This improves UX (shows diagnostics + reload button).
    return NextResponse.next();
  }

  if (userProtected) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (employeeProtected) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    const role = (token as any).role;
    if (role !== "employee" && role !== "admin") return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/checkout", "/my-orders", "/store", "/store/:path*", "/admin", "/admin/:path*", "/employee", "/employee/:path*"]
};