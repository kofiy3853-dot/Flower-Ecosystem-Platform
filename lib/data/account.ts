// ============================================================
// File: lib/data/account.ts
// ============================================================

import { db } from "@/lib/db";

export async function getAccountByUserId(userId: string) {
  return db.account.findFirst({
    where: { userId },
  });
}
