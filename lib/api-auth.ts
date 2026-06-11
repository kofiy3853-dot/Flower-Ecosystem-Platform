// ============================================================
// File: lib/api-auth.ts
// API Route Protection Utilities
// Usage: In Next.js API routes for authorization checks
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { RoleName } from "@prisma/client";

interface ProtectedApiOptions {
  roles?: RoleName[];
  permissions?: string[];
  requireAll?: boolean;
}

/**
 * Protect API routes with authentication and authorization
 *
 * Usage in API route:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const authResult = await protectApiRoute(request, {
 *     roles: ["ADMIN"],
 *   });
 *
 *   if (!authResult.authenticated) {
 *     return authResult.response;
 *   }
 *
 *   const session = authResult.session;
 *   // Handle API logic
 * }
 * ```
 */
export async function protectApiRoute(
  request: NextRequest,
  options: ProtectedApiOptions = {}
) {
  const session = await auth();

  // 1. Check authentication
  if (!session?.user) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  // 2. Check roles
  if (options.roles && options.roles.length > 0) {
    const hasRole = options.roles.some((role) =>
      session.user.roles.includes(role)
    );

    if (!hasRole) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        ),
      };
    }
  }

  // 3. Check permissions
  if (options.permissions && options.permissions.length > 0) {
    const hasPermission = options.permissions.some((perm) =>
      session.user.permissions.includes(perm)
    );

    if (!hasPermission) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        ),
      };
    }
  }

  // 4. Check combined access
  if (options.requireAll && options.roles && options.permissions) {
    const hasRole = options.roles.some((role) =>
      session.user.roles.includes(role)
    );
    const hasPermission = options.permissions.some((perm) =>
      session.user.permissions.includes(perm)
    );

    if (!hasRole || !hasPermission) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        ),
      };
    }
  }

  // Access granted
  return {
    authenticated: true,
    session,
    userId: session.user.id,
  };
}
