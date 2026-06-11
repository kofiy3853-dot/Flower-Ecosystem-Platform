// ============================================================
// File: lib/audit.ts
// Audit log helper
// ============================================================

import { db } from "@/lib/db";
import { type AuditAction } from "@prisma/client";

interface AuditLogInput {
  userId?:      string | null;
  adminId?:     string;
  action:       AuditAction;
  resource?:    string;
  resourceId?:  string;
  metadata?:    Record<string, unknown>;
  ipAddress?:   string;
  userAgent?:   string;
  success?:     boolean;
  errorMessage?: string;
}

export async function createAuditLog(input: AuditLogInput) {
  try {
    await db.auditLog.create({
      data: {
        userId:       input.userId,
        adminId:      input.adminId,
        action:       input.action,
        resource:     input.resource,
        resourceId:   input.resourceId,
        metadata:     input.metadata ?? {},
        ipAddress:    input.ipAddress,
        userAgent:    input.userAgent,
        success:      input.success ?? true,
        errorMessage: input.errorMessage,
      },
    });
  } catch (error) {
    // Audit failures must NEVER crash the application
    console.error("[AuditLog] Failed to write audit log:", error);
  }
}
