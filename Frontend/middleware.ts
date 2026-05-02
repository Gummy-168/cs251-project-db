import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_AUTH_COOKIE_NAME,
  AUTH_COOKIE_NAME,
  isAdminPath,
  isAdminPublicPath,
  isProtectedPath,
} from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isAdminPath(pathname)) {
    if (isAdminPublicPath(pathname)) {
      return NextResponse.next();
    }

    const isAdminAuthenticated =
      request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value === "1";

    if (isAdminAuthenticated) {
      return NextResponse.next();
    }

    const adminLoginUrl = new URL("/Admin/login", request.url);
    adminLoginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(adminLoginUrl);
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === "1";
  if (isAuthenticated) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/User/Signin", request.url);
  signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/User/:path*", "/Admin/:path*"],
};
