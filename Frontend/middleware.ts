import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  isProtectedPath,
} from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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
  matcher: ["/User/:path*"],
};
