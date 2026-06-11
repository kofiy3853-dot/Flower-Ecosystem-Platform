// ============================================================
// File: lib/auth-actions.ts
// Server Actions for Login/Logout
// Handles: Session creation, authentication, session revocation
// Security: CSRF protection (built-in), secure cookies, audit logging
// ============================================================

"use server";

import { signIn, signOut } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";
import { createAuditLog } from "@/lib/audit";
import { getUserByEmail } from "@/lib/data/user";
import { db } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { headers } from "next/headers";

// ============================================================
// LOGIN ACTION
// ============================================================

export async function loginAction(credentials: unknown) {
  try {
    // 1. Validate input
    const validation = loginSchema.safeParse(credentials);
    if (!validation.success) {
      return {
        error: "Invalid email or password format",
        success: false,
      };
    }

    const { email, password, mfaCode } = validation.data;
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "unknown";

    // 2. Fetch user
    const user = await getUserByEmail(email);
    if (!user) {
      await createAuditLog({
        action: AuditAction.USER_LOGIN_FAILED,
        metadata: { email, reason: "USER_NOT_FOUND", ip },
        success: false,
      });

      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    // 3. Check account status
    if (user.status === "SUSPENDED") {
      await createAuditLog({
        userId: user.id,
        action: AuditAction.USER_LOGIN_FAILED,
        metadata: { reason: "ACCOUNT_SUSPENDED", ip },
        success: false,
      });

      return {
        error: "Your account has been suspended",
        success: false,
      };
    }

    if (user.status === "DELETED") {
      await createAuditLog({
        action: AuditAction.USER_LOGIN_FAILED,
        metadata: { email, reason: "ACCOUNT_DELETED", ip },
        success: false,
      });

      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    // 4. Check email verification
    if (!user.emailVerified) {
      await createAuditLog({
        userId: user.id,
        action: AuditAction.USER_LOGIN_FAILED,
        metadata: { reason: "EMAIL_NOT_VERIFIED", ip },
        success: false,
      });

      return {
        error: "Please verify your email before logging in",
        success: false,
      };
    }

    // 5. Check lockout status
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000
      );

      await createAuditLog({
        userId: user.id,
        action: AuditAction.USER_LOGIN_FAILED,
        metadata: {
          reason: "ACCOUNT_LOCKED",
          remainingMinutes,
          ip,
        },
        success: false,
      });

      return {
        error: `Account locked. Try again in ${remainingMinutes} minutes`,
        success: false,
      };
    }

    // 6. Attempt NextAuth sign in with credentials
    const result = await signIn("credentials", {
      email,
      password,
      mfaCode,
      redirect: false,
    });

    if (!result?.ok) {
      await createAuditLog({
        userId: user.id,
        action: AuditAction.USER_LOGIN_FAILED,
        metadata: {
          reason: "INVALID_CREDENTIALS",
          ip,
        },
        success: false,
      });

      return {
        error: "Invalid credentials",
        success: false,
      };
    }

    // 7. Log successful login
    await createAuditLog({
      userId: user.id,
      action: AuditAction.USER_LOGIN,
      metadata: { ip, provider: "credentials" },
      success: true,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("[LoginAction] Error:", error);

    return {
      error: "An error occurred during login. Please try again.",
      success: false,
    };
  }
}

// ============================================================
// LOGOUT ACTION
// ============================================================

export async function logoutAction() {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "unknown";

    // Get current session before signing out
    // Note: In production, you'd fetch the actual user session from auth()
    // For now, we log the logout action
    await createAuditLog({
      action: AuditAction.USER_LOGOUT,
      metadata: { ip },
      success: true,
    });

    // Sign out (clears session and cookies)
    await signOut({ redirectTo: "/auth/login" });
  } catch (error) {
    console.error("[LogoutAction] Error:", error);

    return {
      error: "Logout failed",
      success: false,
    };
  }
}

// ============================================================
// REVOKE ALL SESSIONS (Admin/Security)
// ============================================================

export async function revokeAllSessionsAction(userId: string) {
  try {
    // 1. Revoke all active sessions for user
    await db.session.updateMany(
      {
        where: { userId },
      },
      {
        isRevoked: true,
        revokedAt: new Date(),
      }
    );

    // 2. Log action
    await createAuditLog({
      userId,
      action: AuditAction.ALL_SESSIONS_REVOKED,
      metadata: { reason: "ADMIN_INITIATED" },
      success: true,
    });

    return {
      success: true,
      message: "All sessions revoked",
    };
  } catch (error) {
    console.error("[RevokeAllSessionsAction] Error:", error);

    return {
      error: "Failed to revoke sessions",
      success: false,
    };
  }
}

// ============================================================
// REVOKE SINGLE SESSION
// ============================================================

export async function revokeSingleSessionAction(sessionToken: string) {
  try {
    // 1. Revoke session
    await db.session.update(
      {
        where: { sessionToken },
      },
      {
        isRevoked: true,
        revokedAt: new Date(),
      }
    );

    // 2. Log action
    await createAuditLog({
      action: AuditAction.SESSION_REVOKED,
      metadata: { sessionToken },
      success: true,
    });

    return {
      success: true,
      message: "Session revoked",
    };
  } catch (error) {
    console.error("[RevokeSingleSessionAction] Error:", error);

    return {
      error: "Failed to revoke session",
      success: false,
    };
  }
}
