// ============================================================
// File: lib/profile-actions.ts
// Server Actions for Profile Management
// ============================================================

"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { hash, compare } from "bcryptjs";
import { createAuditLog } from "@/lib/audit";
import { AuditAction } from "@prisma/client";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations/profile";

// ============================================================
// GET USER PROFILE
// ============================================================

export async function getUserProfile() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        image: true,
        emailVerified: true,
        mfaEnabled: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return { error: "User not found", success: false };
    }

    return { success: true, user };
  } catch (error) {
    console.error("[getUserProfile] Error:", error);
    return { error: "Failed to fetch profile", success: false };
  }
}

// ============================================================
// UPDATE PROFILE
// ============================================================

export async function updateProfileAction(data: unknown) {
  try {
    // 1. Get current user
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    // 2. Validate input
    const validation = updateProfileSchema.safeParse(data);
    if (!validation.success) {
      return {
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
        success: false,
      };
    }

    const updates = validation.data;

    // 3. Update user fields
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(updates.name && { name: updates.name }),
      },
      select: { id: true, email: true, name: true },
    });

    // 4. Update or create profile
    const profile = await db.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        ...(updates.bio !== undefined && { bio: updates.bio || null }),
        ...(updates.phone !== undefined && { phone: updates.phone || null }),
        ...(updates.location !== undefined && { location: updates.location || null }),
        ...(updates.website !== undefined && { website: updates.website || null }),
        ...(updates.timezone && { timezone: updates.timezone }),
        ...(updates.language && { language: updates.language }),
        ...(updates.emailNotifications !== undefined && { emailNotifications: updates.emailNotifications }),
        ...(updates.marketingEmails !== undefined && { marketingEmails: updates.marketingEmails }),
      },
      create: {
        userId: session.user.id,
        bio: updates.bio || null,
        phone: updates.phone || null,
        location: updates.location || null,
        website: updates.website || null,
        timezone: updates.timezone || "UTC",
        language: updates.language || "en",
        emailNotifications: updates.emailNotifications ?? true,
        marketingEmails: updates.marketingEmails ?? false,
      },
    });

    // 5. Log action
    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.USER_PROFILE_UPDATED,
      resource: "UserProfile",
      resourceId: profile.id,
      metadata: { updatedFields: Object.keys(updates) },
      success: true,
    });

    return {
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profile,
    };
  } catch (error) {
    console.error("[updateProfileAction] Error:", error);
    return { error: "Failed to update profile", success: false };
  }
}

// ============================================================
// CHANGE PASSWORD
// ============================================================

export async function changePasswordAction(data: unknown) {
  try {
    // 1. Get current user
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    // 2. Validate input
    const validation = changePasswordSchema.safeParse(data);
    if (!validation.success) {
      return {
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
        success: false,
      };
    }

    const { currentPassword, newPassword } = validation.data;

    // 3. Fetch user with hashed password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, hashedPassword: true },
    });

    if (!user || !user.hashedPassword) {
      await createAuditLog({
        userId: session.user.id,
        action: AuditAction.PASSWORD_CHANGED,
        metadata: { reason: "NO_PASSWORD_SET", ip: "unknown" },
        success: false,
        errorMessage: "No password set on account",
      });

      return { error: "No password set on this account", success: false };
    }

    // 4. Verify current password
    const passwordMatch = await compare(currentPassword, user.hashedPassword);
    if (!passwordMatch) {
      await createAuditLog({
        userId: session.user.id,
        action: AuditAction.PASSWORD_CHANGED,
        metadata: { reason: "INCORRECT_PASSWORD" },
        success: false,
        errorMessage: "Incorrect current password",
      });

      return { error: "Incorrect current password", success: false };
    }

    // 5. Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // 6. Update password
    await db.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    });

    // 7. Revoke all sessions (force re-login)
    await db.session.updateMany(
      { where: { userId: session.user.id } },
      { isRevoked: true, revokedAt: new Date() }
    );

    // 8. Log action
    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.PASSWORD_CHANGED,
      success: true,
    });

    return {
      success: true,
      message: "Password changed successfully. Please log in again.",
    };
  } catch (error) {
    console.error("[changePasswordAction] Error:", error);
    return { error: "Failed to change password", success: false };
  }
}

// ============================================================
// ENABLE MFA
// ============================================================

export async function enableMfaAction(secret: string, backupCodes: string[]) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    // Hash backup codes (production: use crypto)
    const hashedCodes = await Promise.all(
      backupCodes.map((code) => hash(code, 10))
    );

    // Update user
    await db.user.update({
      where: { id: session.user.id },
      data: {
        mfaEnabled: true,
        mfaSecret: secret, // Production: encrypt this
        mfaBackupCodes: hashedCodes,
      },
    });

    // Log action
    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.MFA_ENABLED,
      success: true,
    });

    return {
      success: true,
      message: "MFA enabled successfully",
    };
  } catch (error) {
    console.error("[enableMfaAction] Error:", error);
    return { error: "Failed to enable MFA", success: false };
  }
}

// ============================================================
// DISABLE MFA
// ============================================================

export async function disableMfaAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }

    // Disable MFA
    await db.user.update({
      where: { id: session.user.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
      },
    });

    // Log action
    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.MFA_DISABLED,
      success: true,
    });

    return {
      success: true,
      message: "MFA disabled successfully",
    };
  } catch (error) {
    console.error("[disableMfaAction] Error:", error);
    return { error: "Failed to disable MFA", success: false };
  }
}
