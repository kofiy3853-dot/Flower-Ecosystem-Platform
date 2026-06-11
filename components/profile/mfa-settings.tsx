// ============================================================
// File: components/profile/mfa-settings.tsx
// MFA Settings Component
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/hooks/use-session";
import { enableMfaAction, disableMfaAction } from "@/lib/profile-actions";

export function MfaSettings() {
  const { session, isLoading } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const mfaEnabled = session?.user?.mfaEnabled || false;

  const handleToggleMfa = async () => {
    setIsUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      let result;

      if (mfaEnabled) {
        result = await disableMfaAction();
      } else {
        // In production, generate actual QR code and backup codes
        const secret = "TEMP_SECRET";
        const backupCodes = Array.from({ length: 10 }, () =>
          Math.random().toString(36).slice(2, 10)
        );
        result = await enableMfaAction(secret, backupCodes);
      }

      if (!result.success) {
        setError(result.error || "Failed to update MFA");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
          MFA settings updated successfully
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-sm">Two-Factor Authentication</p>
          <p className="text-xs text-gray-600 mt-1">
            {mfaEnabled
              ? "MFA is enabled on your account"
              : "MFA is not enabled on your account"}
          </p>
        </div>
        <div>
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
              mfaEnabled
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {mfaEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Info */}
      <p className="text-sm text-gray-600">
        {mfaEnabled
          ? "Two-factor authentication adds an extra layer of security to your account. You will need to enter a code from your authenticator app when logging in."
          : "Enable two-factor authentication to add an extra layer of security to your account."}
      </p>

      {/* Toggle Button */}
      <button
        onClick={handleToggleMfa}
        disabled={isUpdating}
        className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          mfaEnabled
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:opacity-50`}
      >
        {isUpdating
          ? "Updating..."
          : mfaEnabled
            ? "Disable MFA"
            : "Enable MFA"}
      </button>
    </div>
  );
}
