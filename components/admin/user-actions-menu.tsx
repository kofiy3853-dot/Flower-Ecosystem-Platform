// ============================================================
// File: components/admin/user-actions-menu.tsx
// User Actions Menu Component
// Actions: View, Edit, Suspend, Assign Roles, Delete
// ============================================================

"use client";

import { useState } from "react";
import { UserStatus } from "@prisma/client";
import { UserRoleModal } from "@/components/admin/user-role-modal";
import { UserStatusModal } from "@/components/admin/user-status-modal";

interface UserActionsMenuProps {
  userId: string;
  userStatus: UserStatus;
}

export function UserActionsMenu({ userId, userStatus }: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Actions
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                setShowRoleModal(true);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Assign Roles
            </button>
            <button
              onClick={() => {
                setShowStatusModal(true);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Change Status
            </button>
            <a
              href={`/admin/users/${userId}`}
              className="block px-4 py-2 hover:bg-gray-50 text-sm"
            >
              View Details
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      {showRoleModal && (
        <UserRoleModal
          userId={userId}
          onClose={() => setShowRoleModal(false)}
        />
      )}
      {showStatusModal && (
        <UserStatusModal
          userId={userId}
          currentStatus={userStatus}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </>
  );
}
