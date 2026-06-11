// ============================================================
// FLOWER ECOSYSTEM PLATFORM — AUTH.JS v5 CONFIGURATION
// File: auth.ts (root level)
// Owner: Senior Authentication Engineer
// ============================================================

import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";
import { getUserByEmail, getUserById } from "@/lib/data/user";
import { getAccountByUserId } from "@/lib/data/account";
import { UserStatus, type RoleName } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";

// ============================================================
// TYPE AUGMENTATION — Extend session/token with custom fields
// ============================================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      status: UserStatus;
      roles: RoleName[];
      permissions: string[];
      isMfaVerified: boolean;
      isOAuth: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    status: UserStatus;
    roles: RoleName[];
    permissions: string[];
    isMfaVerified: boolean;
    isOAuth: boolean;
  }
}

// ============================================================
// AUTH CONFIG
// ============================================================

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  // Database sessions — required for server-side revocations
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // Refresh every 24 hours
  },
  pages: {
    signIn:  "/auth/login",
    signOut: "/auth/logout",
    error:   "/auth/error",
    verifyRequest: "/auth/verify-email",
    newUser: "/auth/onboarding",
  },
  providers: [
    // ----------------------------------------------------------
    // CREDENTIALS — Email / Password
    // ----------------------------------------------------------
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
        mfaCode:  { label: "MFA Code", type: "text"     },
      },
      async authorize(credentials, request) {
        // 1. Validate input shape
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password, mfaCode } = parsed.data;
        const ip = request.headers?.get("x-forwarded-for") ?? "unknown";

        // 2. Fetch user
        const user = await getUserByEmail(email);
        if (!user || !user.hashedPassword) {
          await createAuditLog({
            action: "USER_LOGIN_FAILED",
            metadata: { email, reason: "USER_NOT_FOUND", ip },
            success: false,
          });
          return null;
        }

        // 3. Check account status
        if (user.status === UserStatus.SUSPENDED) {
          await createAuditLog({
            userId: user.id,
            action: "USER_LOGIN_FAILED",
            metadata: { reason: "ACCOUNT_SUSPENDED", ip },
            success: false,
          });
          throw new Error("ACCOUNT_SUSPENDED");
        }

        if (user.status === UserStatus.DELETED) {
          return null;
        }

        // 4. Check brute-force lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await createAuditLog({
            userId: user.id,
            action: "USER_LOGIN_FAILED",
            metadata: { reason: "ACCOUNT_LOCKED", lockedUntil: user.lockedUntil, ip },
            success: false,
          });
          throw new Error("ACCOUNT_LOCKED");
        }

        // 5. Verify password
        const passwordMatch = await compare(password, user.hashedPassword);
        if (!passwordMatch) {
          await handleFailedLogin(user.id, ip);
          throw new Error("INVALID_CREDENTIALS");
        }

        // 6. Check email verification
        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        // 7. MFA check
        if (user.mfaEnabled) {
          if (!mfaCode) throw new Error("MFA_REQUIRED");
          const mfaValid = await verifyMfaCode(user.id, mfaCode);
          if (!mfaValid) {
            await createAuditLog({
              userId: user.id,
              action: "MFA_FAILED",
              metadata: { ip },
              success: false,
            });
            throw new Error("INVALID_MFA_CODE");
          }
        }

        // 8. Reset failed attempts on success
        await db.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            lastLoginIp: ip,
          },
        });

        await createAuditLog({
          userId: user.id,
          action: "USER_LOGIN",
          metadata: { ip, provider: "credentials" },
          success: true,
        });

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
        };
      },
    }),
    // ----------------------------------------------------------
    // GOOGLE OAuth
    // ----------------------------------------------------------
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // ============================================================
  // CALLBACKS
  // ============================================================
  callbacks: {
    // ----------------------------------------------------------
    // signIn — Gate access, handle OAuth user provisioning
    // ----------------------------------------------------------
    async signIn({ user, account }) {
      // Allow OAuth without email verification requirement
      if (account?.provider !== "credentials") {
        await ensureUserHasRole(user.id!);
        return true;
      }

      const dbUser = await getUserById(user.id!);
      if (!dbUser) return false;
      if (!dbUser.emailVerified) return "/auth/verify-email?error=unverified";
      if (dbUser.status === UserStatus.SUSPENDED) return "/auth/error?error=suspended";
      if (dbUser.status === UserStatus.DELETED) return false;

      return true;
    },

    // ----------------------------------------------------------
    // session — Enrich session with roles, permissions, status
    // ----------------------------------------------------------
    async session({ session, user }) {
      if (!session.user || !user.id) return session;

      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: {
          status: true,
          mfaEnabled: true,
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
        },
      });

      if (!dbUser) return session;

      const roles = dbUser.userRoles.map((ur) => ur.role.name);
      const permissions = [...new Set(dbUser.userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.name)
      ))];

      const oauthAccount = await getAccountByUserId(user.id);

      session.user.id            = user.id;
      session.user.status        = dbUser.status;
      session.user.roles         = roles;
      session.user.permissions   = permissions;
      session.user.isMfaVerified = dbUser.mfaEnabled;
      session.user.isOAuth       = !!oauthAccount;

      return session;
    },
  },

  // ============================================================
  // EVENTS — Side effects (audit logging, provisioning)
  // ============================================================
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && account?.provider !== "credentials") {
        // Provision default USER role for new OAuth signups
        await ensureUserHasRole(user.id!);
        await createAuditLog({
          userId: user.id,
          action: "USER_REGISTERED",
          metadata: { provider: account?.provider },
          success: true,
        });
      }
    },

    async signOut({ session }) {
      if (session && "userId" in session) {
        await createAuditLog({
          userId: session.userId as string,
          action: "USER_LOGOUT",
          success: true,
        });
      }
    },

    async createSession({ session }) {
      await createAuditLog({
        action: "SESSION_CREATED",
        metadata: { sessionToken: session.sessionToken },
        success: true,
      });
    },
  },

  // ============================================================
  // SECURITY
  // ============================================================
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// ============================================================
// HELPERS (private to this module)
// ============================================================

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

async function handleFailedLogin(userId: string, ip: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { loginAttempts: true },
  });

  if (!user) return;

  const attempts = user.loginAttempts + 1;
  const shouldLock = attempts >= MAX_LOGIN_ATTEMPTS;

  await db.user.update({
    where: { id: userId },
    data: {
      loginAttempts: attempts,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000)
        : undefined,
    },
  });

  await createAuditLog({
    userId,
    action: "USER_LOGIN_FAILED",
    metadata: { attempts, locked: shouldLock, ip },
    success: false,
  });
}

async function ensureUserHasRole(userId: string) {
  const defaultRole = await db.role.findUnique({
    where: { name: "USER" },
  });

  if (!defaultRole) return;

  await db.userRole.upsert({
    where: { userId_roleId: { userId, roleId: defaultRole.id } },
    update: {},
    create: { userId, roleId: defaultRole.id },
  });
}

async function verifyMfaCode(userId: string, code: string): Promise<boolean> {
  // Dynamically import to keep bundle lean
  const { authenticator } = await import("otplib");
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { mfaSecret: true, mfaBackupCodes: true },
  });

  if (!user?.mfaSecret) return false;

  // Decrypt secret (implement decryptSecret in your crypto module)
  const { decryptSecret } = await import("@/lib/crypto");
  const secret = decryptSecret(user.mfaSecret);

  // Check TOTP first
  if (authenticator.check(code, secret)) return true;

  // Check backup codes
  const { compare: bcryptCompare } = await import("bcryptjs");
  for (const hashedCode of user.mfaBackupCodes) {
    const match = await bcryptCompare(code, hashedCode);
    if (match) {
      // Invalidate used backup code
      await db.user.update({
        where: { id: userId },
        data: {
          mfaBackupCodes: user.mfaBackupCodes.filter((c) => c !== hashedCode),
        },
      });
      return true;
    }
  }

  return false;
}
