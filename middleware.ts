import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup"];
const AUTH_ONLY_PATHS = ["/login", "/signup"]; // redirect away if already logged in
const ONBOARDING_PATH = "/onboarding";

function decodeJWT(token: string): { onboardingComplete?: boolean; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (decoded.exp && decoded.exp < Date.now() / 1000) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API, static files, Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ls_token")?.value;

  // --- Not logged in ---
  if (!token) {
    if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();
    if (pathname === ONBOARDING_PATH) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = decodeJWT(token);

  // Expired / invalid token
  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("ls_token", "", { maxAge: 0, path: "/" });
    return response;
  }

  const onboarded = payload.onboardingComplete === true;

  // --- Logged in but not onboarded ---
  if (!onboarded) {
    if (pathname === ONBOARDING_PATH) return NextResponse.next();
    if (AUTH_ONLY_PATHS.includes(pathname)) return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
    // Allow home page but redirect protected pages
    if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();
    return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
  }

  // --- Fully logged in and onboarded ---
  // Redirect away from login/signup/onboarding
  if (AUTH_ONLY_PATHS.includes(pathname) || pathname === ONBOARDING_PATH) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
