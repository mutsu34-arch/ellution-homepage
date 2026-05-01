import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const adminKey = process.env.MAINTENANCE_ADMIN_KEY;

  if (!path.startsWith("/api/") && path.startsWith("/__admin/unlock")) {
    const key = request.nextUrl.searchParams.get("key");
    if (adminKey && key === adminKey) {
      const redirectUrl = new URL("/", request.url);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set("maintenance_admin", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  if (!path.startsWith("/api/") && path.startsWith("/__admin/lock")) {
    const redirectUrl = new URL("/maintenance", request.url);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete("maintenance_admin");
    return response;
  }

  if (maintenanceMode && !path.startsWith("/api/")) {

    const isAdmin = request.cookies.get("maintenance_admin")?.value === "1";
    const isAllowedPath = path.startsWith("/maintenance");

    if (!isAdmin && !isAllowedPath) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }

    if (isAdmin && path.startsWith("/maintenance")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (path.startsWith("/dashboard") || path.startsWith("/api/checkout")) {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = secret
      ? await getToken({ req: request, secret })
      : null;
    if (!token) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const login = new URL("/login", request.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    "/api/checkout/:path*",
  ],
};
