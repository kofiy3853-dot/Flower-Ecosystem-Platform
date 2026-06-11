// ============================================================
// File: app/(protected)/admin/users/page.tsx
// Admin Dashboard - User Management Page
// Shows: User list, search, filters, bulk actions
// Auth: SUPER_ADMIN, ADMIN
// ============================================================

import { ProtectedRoute } from "@/components/auth/protected-route";
import { UsersTable } from "@/components/admin/users-table";
import { UsersFilters } from "@/components/admin/users-filters";
import type { RoleName } from "@prisma/client";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string };
}) {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-2">
            Manage users, assign roles, and control access
          </p>
        </div>

        {/* Filters */}
        <UsersFilters />

        {/* Users Table */}
        <UsersTable
          page={searchParams.page ? parseInt(searchParams.page) : 1}
          search={searchParams.search || ""}
          status={searchParams.status}
        />
      </div>
    </ProtectedRoute>
  );
}
