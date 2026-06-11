// ============================================================
// File: lib/auth-server.ts
// Server-side Authentication Utilities
// Use in: API routes, Server Components, Server Actions
// ============================================================

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

// ============================================================
// Get current session (server-side)
// ============================================================
export async function getCurrentSession(): Promise<Session | null> {
  const session = await auth();
  return session;
}

// ============================================================
// Get current user (server-side)
// ============================================================
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user;
}

// ============================================================
// Require authentication (server-side)
// Throws redirect if not authenticated
// ============================================================
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return session;
}

// ============================================================
// Require specific role(s)
// Throws redirect if insufficient permissions
// ============================================================
export async function requireRole(allowedRoles: string | string[]) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  const hasRole = roles.some((role) =>
    session.user.roles.includes(role)
  );

  if (!hasRole) {
    redirect("/403");
  }

  return session;
}

// ============================================================
// Require specific permission(s)
// Throws redirect if insufficient permissions
// ============================================================
export async function requirePermission(
  allowedPermissions: string | string[]
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const permissions = Array.isArray(allowedPermissions)
    ? allowedPermissions
    : [allowedPermissions];

  const hasPermission = permissions.some((perm) =>
    session.user.permissions.includes(perm)
  );

  if (!hasPermission) {
    redirect("/403");
  }

  return session;
}

// ============================================================
// Check access without redirecting
// ============================================================
export async function canAccess(options: {
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // true = AND, false = OR (default)
}): Promise<boolean> {
  const session = await auth();

  if (!session?.user) return false;

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
