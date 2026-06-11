// ============================================================
// File: components/admin/user-role-modal.tsx
// User Role Assignment Modal
// ============================================================

"use client";

import { useState, useEffect } from "react";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface UserRoleModalProps {
  userId: string;
  onClose: () => void;
}

export function UserRoleModal({ userId, onClose }: UserRoleModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available roles
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/admin/roles");
        const data = await response.json();
        setRoles(data.roles || []);
      } catch (err) {
        setError("Failed to load roles");
      }
    };

    fetchRoles();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: selectedRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to assign role");
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Assign Role</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">
            {error}
          </div>
        )}

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        >
          <option value="">Select a role...</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignRole}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
