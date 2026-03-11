import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
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
  matcher: ["/dashboard/:path*", "/api/checkout/:path*"],
};
