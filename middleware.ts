// ============================================================
// FLOWER ECOSYSTEM PLATFORM — MIDDLEWARE
// File: middleware.ts (root level)
// Owner: Senior Authentication Engineer
// ============================================================

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { RoleName } from "@prisma/client";

// ============================================================
// ROUTE DEFINITIONS
// ============================================================

// Publicly accessible — no auth required
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/error",
];

// Auth pages — redirect to dashboard if already logged in
const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

// Role-gated routes — map prefix → required role
const ROLE_PROTECTED_ROUTES: Record<string, RoleName[]> = {
  "/admin":        ["SUPER_ADMIN", "ADMIN"],
  "/admin/users":  ["SUPER_ADMIN", "ADMIN"],
  "/admin/roles":  ["SUPER_ADMIN"],
  "/moderator":    ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
};

// API routes that require authentication
const PROTECTED_API_PREFIXES = [
  "/api/user",
  "/api/admin",
  "/api/profile",
];

const DEFAULT_LOGIN_REDIRECT  = "/dashboard";
const DEFAULT_UNAUTHORIZED    = "/auth/login";

// ============================================================
// MIDDLEWARE
// ============================================================

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl, auth: session } = req as NextRequest & { auth: typeof auth };
  const isLoggedIn = !!session?.user;
  const pathname   = nextUrl.pathname;

  // ----------------------------------------------------------
  // 1. Static assets & Next internals — skip immediately
  // ----------------------------------------------------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ----------------------------------------------------------
  // 2. Protected API routes
  // ----------------------------------------------------------
  if (PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ----------------------------------------------------------
  // 3. Suspended / deleted accounts — force out immediately
  // ----------------------------------------------------------
  if (isLoggedIn) {
    const status = session?.user?.status;
    if (status === "SUSPENDED" || status === "DELETED") {
      const response = NextResponse.redirect(new URL("/auth/error?error=suspended", nextUrl));
      response.cookies.delete("__Secure-next-auth.session-token");
      response.cookies.delete("next-auth.session-token");
      return response;
    }
  }

  // ----------------------------------------------------------
  // 4. Auth routes — redirect logged-in users to dashboard
  // ----------------------------------------------------------
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // ----------------------------------------------------------
  // 5. Public routes — always accessible
  // ----------------------------------------------------------
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return NextResponse.next();
  }

  // ----------------------------------------------------------
  // 6. Unauthenticated — redirect to login with callbackUrl
  // ----------------------------------------------------------
  if (!isLoggedIn) {
    const loginUrl = new URL(DEFAULT_UNAUTHORIZED, nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ----------------------------------------------------------
  // 7. Role-based route protection
  // ----------------------------------------------------------
  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PROTECTED_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      const userRoles: RoleName[] = session?.user?.roles ?? [];
      const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

      if (!hasAccess) {
        // Redirect to 403 page instead of leaking route existence
        return NextResponse.redirect(new URL("/403", nextUrl));
      }
      break;
    }
  }

  // ----------------------------------------------------------
  // 8. Attach user context headers for server components
  // ----------------------------------------------------------
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id",    session?.user?.id ?? "");
  requestHeaders.set("x-user-roles", JSON.stringify(session?.user?.roles ?? []));

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)",],
};
