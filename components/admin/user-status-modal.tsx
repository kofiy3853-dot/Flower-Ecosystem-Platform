// ============================================================
// File: components/admin/user-status-modal.tsx
// User Status Change Modal
// ============================================================

"use client";

import { useState } from "react";
import { UserStatus } from "@prisma/client";

interface UserStatusModalProps {
  userId: string;
  currentStatus: UserStatus;
  onClose: () => void;
}

const statusOptions: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
];

export function UserStatusModal({
  userId,
  currentStatus,
  onClose,
}: UserStatusModalProps) {
  const [newStatus, setNewStatus] = useState<UserStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangeStatus = async () => {
    if (newStatus === currentStatus) {
      setError("Please select a different status");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          status: newStatus,
          reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
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
        <h2 className="text-lg font-semibold mb-4">Change User Status</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">New Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as UserStatus)}
            className="w-full px-4 py-2 border rounded"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you changing this status?"
            className="w-full px-4 py-2 border rounded text-sm"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleChangeStatus}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
