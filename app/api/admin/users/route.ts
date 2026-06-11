// ============================================================
// File: app/api/admin/users/route.ts
// Admin User Management API
// Endpoints: GET (list), POST (create)
// Auth: SUPER_ADMIN, ADMIN roles required
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { protectApiRoute } from "@/lib/api-auth";
import { createAuditLog } from "@/lib/audit";
import { AuditAction, UserStatus } from "@prisma/client";

// ============================================================
// GET /api/admin/users
// List all users with pagination and filtering
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Protect route
    const auth = await protectApiRoute(request, {
      roles: ["SUPER_ADMIN", "ADMIN"],
    });

    if (!auth.authenticated) return auth.response;

    // 2. Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") as UserStatus | null;

    const skip = (page - 1) * limit;

    // 3. Build query filters
    const where: any = {
      deletedAt: null, // Exclude soft-deleted users
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // 4. Fetch users
    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          status: true,
          emailVerified: true,
          mfaEnabled: true,
          createdAt: true,
          userRoles: {
            select: {
              role: {
                select: { name: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where }),
    ]);

    // 5. Format response
    const formattedUsers = users.map((user) => ({
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
      userRoles: undefined,
    }));

    return NextResponse.json({
      data: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/users] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/admin/users/[userId]/status
// Update user status (suspend/activate/delete)
// ============================================================

export async function PATCH(request: NextRequest) {
  try {
    // 1. Protect route
    const auth = await protectApiRoute(request, {
      roles: ["SUPER_ADMIN"],
    });

    if (!auth.authenticated) return auth.response;

    // 2. Parse request body
    const body = await request.json();
    const { userId, status, reason } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { error: "Missing userId or status" },
        { status: 400 }
      );
    }

    if (!Object.values(UserStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // 3. Fetch user
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Prevent self-suspension
    if (userId === auth.userId && status === UserStatus.SUSPENDED) {
      return NextResponse.json(
        { error: "Cannot suspend your own account" },
        { status: 400 }
      );
    }

    // 5. Update status
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    // 6. Log action
    const auditAction =
      status === UserStatus.SUSPENDED
        ? AuditAction.USER_SUSPENDED
        : status === UserStatus.ACTIVE
          ? AuditAction.USER_ACTIVATED
          : AuditAction.USER_PROFILE_UPDATED;

    await createAuditLog({
      userId,
      adminId: auth.userId,
      action: auditAction,
      resource: "User",
      resourceId: userId,
      metadata: { previousStatus: user.status, newStatus: status, reason },
      success: true,
    });

    return NextResponse.json({
      message: `User status updated to ${status}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/users] Error:", error);

    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
