// ============================================================
// File: lib/data/user.ts
// Data access layer — User queries (auth module)
// ============================================================

import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      hashedPassword: true,
      status: true,
      emailVerified: true,
      mfaEnabled: true,
      mfaSecret: true,
      mfaBackupCodes: true,
      loginAttempts: true,
      lockedUntil: true,
    },
  });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      status: true,
      emailVerified: true,
      mfaEnabled: true,
    },
  });
}

export async function getUserWithRoles(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
      profile: true,
    },
  });
}
