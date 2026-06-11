// ============================================================
// File: app/api/admin/users/[userId]/roles/route.ts
// Admin User Role Assignment API
// Endpoints: GET (user roles), POST (assign), DELETE (remove)
// Auth: SUPER_ADMIN required
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { protectApiRoute } from "@/lib/api-auth";
import { createAuditLog } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

// ============================================================
// GET /api/admin/users/[userId]/roles
// Get user's current roles
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 1. Protect route
    const auth = await protectApiRoute(request, {
      roles: ["SUPER_ADMIN"],
    });

    if (!auth.authenticated) return auth.response;

    const { userId } = params;

    // 2. Fetch user roles
    const userRoles = await db.userRole.findMany({
      where: { userId },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    const roles = userRoles.map((ur) => ({
      ...ur.role,
      assignedAt: ur.createdAt,
      expiresAt: ur.expiresAt,
    }));

    return NextResponse.json({ roles });
  } catch (error) {
    console.error("[GET /api/admin/users/[userId]/roles] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch user roles" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/admin/users/[userId]/roles
// Assign role to user
// ============================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 1. Protect route
    const auth = await protectApiRoute(request, {
      roles: ["SUPER_ADMIN"],
    });

    if (!auth.authenticated) return auth.response;

    // 2. Parse request body
    const body = await request.json();
    const { roleId, expiresAt } = body;

    if (!roleId) {
      return NextResponse.json(
        { error: "roleId is required" },
        { status: 400 }
      );
    }

    const { userId } = params;

    // 3. Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Verify role exists
    const role = await db.role.findUnique({ where: { id: roleId } });
    if (!role) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    // 5. Check if user already has this role
    const existingRole = await db.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: "User already has this role" },
        { status: 409 }
      );
    }

    // 6. Assign role
    const userRole = await db.userRole.create({
      data: {
        userId,
        roleId,
        assignedBy: auth.userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: { role: true },
    });

    // 7. Log action
    await createAuditLog({
      userId,
      adminId: auth.userId,
      action: AuditAction.USER_ROLE_ASSIGNED,
      resource: "UserRole",
      resourceId: userRole.id,
      metadata: { role: role.name, expiresAt },
      success: true,
    });

    return NextResponse.json(
      {
        message: `Role "${role.name}" assigned to user`,
        userRole,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/users/[userId]/roles] Error:", error);

    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/admin/users/[userId]/roles/[roleId]
// Remove role from user
// ============================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 1. Protect route
    const auth = await protectApiRoute(request, {
      roles: ["SUPER_ADMIN"],
    });

    if (!auth.authenticated) return auth.response;

    // 2. Parse query params for roleId
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get("roleId");

    if (!roleId) {
      return NextResponse.json(
        { error: "roleId is required" },
        { status: 400 }
      );
    }

    const { userId } = params;

    // 3. Remove role
    await db.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });

    // 4. Get role name for audit log
    const role = await db.role.findUnique({ where: { id: roleId } });

    // 5. Log action
    await createAuditLog({
      userId,
      adminId: auth.userId,
      action: AuditAction.USER_ROLE_REVOKED,
      resource: "UserRole",
      resourceId: `${userId}-${roleId}`,
      metadata: { role: role?.name },
      success: true,
    });

    return NextResponse.json({
      message: `Role removed from user`,
    });
  } catch (error) {
    console.error("[DELETE /api/admin/users/[userId]/roles] Error:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "UserRole not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to remove role" },
      { status: 500 }
    );
  }
}
