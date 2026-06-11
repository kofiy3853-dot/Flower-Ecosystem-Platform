// ============================================================
// File: components/auth/auth-guard.tsx
// Client Component for Conditional Rendering
// Usage: Render content based on authentication/authorization
// ============================================================

"use client";

import { ReactNode } from "react";
import { useSession as useNextAuthSession } from "next-auth/react";
import { useHasRole, useHasPermission } from "@/lib/hooks/use-session";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
  requireAuth?: boolean;
}

/**
 * AuthGuard Component
 *
 * Conditionally render content based on authentication and authorization.
 *
 * Examples:
 * - <AuthGuard roles={["ADMIN"]}>Admin content</AuthGuard>
 * - <AuthGuard permissions={["users:read"]}>User list</AuthGuard>
 * - <AuthGuard requireAuth>Protected content</AuthGuard>
 */
export function AuthGuard({
  children,
  fallback = null,
  roles = [],
  permissions = [],
  requireAll = false,
  requireAuth = false,
}: AuthGuardProps) {
  const { status } = useNextAuthSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Show loading state
  if (isLoading) {
    return <div className="animate-pulse" />;
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check roles and permissions
  let hasAccess = true;

  if (roles.length > 0) {
    const hasRole = useHasRole(roles);
    hasAccess = hasAccess && hasRole;
  }

  if (permissions.length > 0) {
    const hasPermission = useHasPermission(permissions);
    hasAccess = hasAccess && hasPermission;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
