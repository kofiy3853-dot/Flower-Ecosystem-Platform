// ============================================================
// File: components/ui/user-status-badge.tsx
// User Status Badge Component
// ============================================================

import { UserStatus } from "@prisma/client";

interface UserStatusBadgeProps {
  status: UserStatus;
}

const statusStyles: Record<UserStatus, { bg: string; text: string; label: string }> = {
  ACTIVE: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Active",
  },
  INACTIVE: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "Inactive",
  },
  SUSPENDED: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Suspended",
  },
  PENDING_VERIFICATION: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Pending",
  },
  DELETED: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Deleted",
  },
};

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}
