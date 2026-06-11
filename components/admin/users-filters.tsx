// ============================================================
// File: components/admin/users-filters.tsx
// Users Filters Component
// Provides: Search, status filter, quick actions
// ============================================================

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserStatus } from "@prisma/client";

export function UsersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page"); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by email, name, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Status Filter */}
      <div className="flex gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Active", value: "ACTIVE" },
          { label: "Inactive", value: "INACTIVE" },
          { label: "Suspended", value: "SUSPENDED" },
          { label: "Pending Verification", value: "PENDING_VERIFICATION" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              searchParams.get("status") === filter.value ||
              (filter.value === "all" && !searchParams.get("status"))
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
