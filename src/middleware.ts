import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "@/lib/auth";

const AUTH_PATHS = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const user = decodeToken(request);

  // Not logged in → only allow /login and /signup
  if (!user) {
    if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but onboarding not complete → force to /onboarding
  if (!user.onboardingComplete && !pathname.startsWith("/onboarding")) {
    const onboardingUrl = request.nextUrl.clone();
    onboardingUrl.pathname = "/onboarding";
    return NextResponse.redirect(onboardingUrl);
  }

  // Logged in and onboarded → redirect away from auth pages
  if (user.onboardingComplete && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
