// ============================================================
// File: components/auth/protected-route.tsx
// Server Component for Protected Routes
// Usage: Wrap page components that require authentication
// ============================================================

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { RoleName } from "@prisma/client";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: RoleName[];
  permissions?: string[];
  requireAll?: boolean;
}

export async function ProtectedRoute({
  children,
  roles,
  permissions,
  requireAll = false,
}: ProtectedRouteProps) {
  const session = await auth();

  // 1. Check authentication
  if (!session?.user) {
    redirect("/auth/login");
  }

  // 2. Check role-based access
  if (roles && roles.length > 0) {
    const hasRole = roles.some((role) =>
      session.user.roles.includes(role)
    );

    if (!hasRole) {
      redirect("/403");
    }
  }

  // 3. Check permission-based access
  if (permissions && permissions.length > 0) {
    const hasPermission = permissions.some((perm) =>
      session.user.permissions.includes(perm)
    );

    if (!hasPermission) {
      redirect("/403");
    }
  }

  // 4. Check combined access (requireAll = AND logic)
  if (requireAll && roles && permissions && roles.length > 0 && permissions.length > 0) {
    const hasRole = roles.some((role) =>
      session.user.roles.includes(role)
    );
    const hasPermission = permissions.some((perm) =>
      session.user.permissions.includes(perm)
    );

    if (!hasRole || !hasPermission) {
      redirect("/403");
    }
  }

  // 5. Access granted
  return children;
}
