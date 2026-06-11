// ============================================================
// File: lib/hooks/use-session.ts
// Client Hook for Session Access
// Provides: Current user, roles, permissions, authentication state
// ============================================================

"use client";

import { useSession as useNextAuthSession } from "next-auth/react";
import type { Session } from "next-auth";

interface ExtendedSession extends Session {
  user: Session["user"] & {
    id: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | "DELETED";
    roles: string[];
    permissions: string[];
    isMfaVerified: boolean;
    isOAuth: boolean;
  };
}

export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    session: session as ExtendedSession | null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isUnauthenticated: status === "unauthenticated",
  };
}

// ============================================================
// Helper: Check if user has specific role
// ============================================================
export function useHasRole(role: string | string[]) {
  const { session } = useSession();

  if (!session?.user) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.some((r) => session.user.roles.includes(r));
}

// ============================================================
// Helper: Check if user has specific permission
// ============================================================
export function useHasPermission(permission: string | string[]) {
  const { session } = useSession();

  if (!session?.user) return false;

  const permissions = Array.isArray(permission) ? permission : [permission];
  return permissions.some((p) => session.user.permissions.includes(p));
}

// ============================================================
// Helper: Check multiple conditions
// ============================================================
export function useCanAccess(options: {
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // true = AND, false = OR (default)
}) {
  const { session, isAuthenticated } = useSession();

  if (!isAuthenticated || !session?.user) return false;

  const { roles = [], permissions = [], requireAll = false } = options;

  if (roles.length === 0 && permissions.length === 0) return true;

  const hasRole =
    roles.length === 0 ||
    roles.some((r) => session.user.roles.includes(r));
  const hasPermission =
    permissions.length === 0 ||
    permissions.some((p) => session.user.permissions.includes(p));

  return requireAll ? hasRole && hasPermission : hasRole || hasPermission;
}
