// ============================================================
// File: lib/hooks/use-auth.ts
// Client Hook for Authentication
// Provides: Login, Logout, Session state management
// ============================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction, logoutAction } from "@/lib/auth-actions";
import type { LoginInput } from "@/lib/validations/auth";

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (credentials: LoginInput) => {
    setState({ isLoading: true, error: null });

    try {
      const result = await loginAction(credentials);

      if (!result.success) {
        setState({ isLoading: false, error: result.error || "Login failed" });
        return { success: false };
      }

      // On success, redirect to dashboard
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setState({ isLoading: false, error: errorMessage });
      return { success: false };
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = async () => {
    setState({ isLoading: true, error: null });

    try {
      await logoutAction();
      // signOut will handle redirect to /auth/login
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      setState({ isLoading: false, error: errorMessage });
      return { success: false };
    }
  };

  return {
    login,
    logout,
    isLoading: state.isLoading,
    error: state.error,
  };
}
