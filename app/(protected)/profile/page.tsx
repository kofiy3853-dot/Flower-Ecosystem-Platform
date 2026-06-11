// ============================================================
// File: app/(protected)/profile/page.tsx
// User Profile Page
// Shows: Profile info, security settings, preferences
// Auth: Required (all authenticated users)
// ============================================================

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { MfaSettings } from "@/components/profile/mfa-settings";

export default async function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage your account information and security settings
          </p>
        </div>

        {/* Profile Section */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <ProfileForm />
        </section>

        {/* Security Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Password */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <ChangePasswordForm />
          </section>

          {/* MFA Settings */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Two-Factor Authentication</h2>
            <MfaSettings />
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
