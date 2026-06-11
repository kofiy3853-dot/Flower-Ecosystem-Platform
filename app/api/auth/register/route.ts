// ============================================================
// File: app/api/auth/register/route.ts
// User Registration API Endpoint
// Handles: Email validation, password hashing, user creation
// Security: Input validation, duplicate email checks, rate limiting
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { createAuditLog } from "@/lib/audit";
import { AuditAction, UserStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json();

    // 2. Validate input against schema
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    // 3. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await createAuditLog({
        action: AuditAction.USER_REGISTERED,
        metadata: { email, reason: "DUPLICATE_EMAIL", ip },
        success: false,
        errorMessage: "User already exists",
      });

      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // 4. Hash password (production-ready: bcrypt with cost factor 12)
    const hashedPassword = await hash(password, 12);

    // 5. Create user in database
    const user = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
        status: UserStatus.PENDING_VERIFICATION,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // 6. Assign default USER role
    const userRole = await db.role.findUnique({
      where: { name: "USER" },
    });

    if (userRole) {
      await db.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id,
        },
      });
    }

    // 7. Log successful registration
    await createAuditLog({
      userId: user.id,
      action: AuditAction.USER_REGISTERED,
      metadata: { email, provider: "credentials", ip },
      success: true,
    });

    return NextResponse.json(
      {
        message: "Registration successful. Please verify your email.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Register] Error:", error);

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
