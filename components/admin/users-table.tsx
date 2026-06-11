// ============================================================
// File: components/admin/users-table.tsx
// Users Table Component
// Shows: User list with actions (edit, suspend, assign roles)
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { User, UserStatus } from "@prisma/client";
import { UserStatusBadge } from "@/components/ui/user-status-badge";
import { UserActionsMenu } from "@/components/admin/user-actions-menu";

interface UsersTableProps {
  page: number;
  search: string;
  status?: string;
}

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  status: UserStatus;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  roles: string[];
}

export function UsersTable({ page, search, status }: UsersTableProps) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...(search && { search }),
          ...(status && { status }),
        });

        const response = await fetch(`/api/admin/users?${params}`);
        const data = await response.json();

        if (response.ok) {
          setUsers(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, search, status]);

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Roles</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">MFA</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{user.email}</td>
              <td className="px-6 py-4 text-sm">{user.name || "-"}</td>
              <td className="px-6 py-4 text-sm">
                <UserStatusBadge status={user.status} />
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex gap-1 flex-wrap">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                {user.mfaEnabled ? (
                  <span className="text-green-600 font-medium">Enabled</span>
                ) : (
                  <span className="text-gray-500">Disabled</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm">
                <UserActionsMenu userId={user.id} userStatus={user.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 flex justify-between items-center border-t bg-gray-50">
        <div className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.pages} ({pagination.total} total)
        </div>
        <div className="flex gap-2">
          <button
            disabled={pagination.page === 1}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
