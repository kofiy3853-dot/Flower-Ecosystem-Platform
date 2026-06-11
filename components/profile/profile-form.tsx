// ============================================================
// File: components/profile/profile-form.tsx
// Profile Form Component
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction, getUserProfile } from "@/lib/profile-actions";

export function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    location: "",
    website: "",
    timezone: "UTC",
    language: "en",
    emailNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getUserProfile();
        if (result.success && result.user) {
          setFormData((prev) => ({
            ...prev,
            name: result.user.name || "",
            ...(result.user.profile && {
              bio: result.user.profile.bio || "",
              phone: result.user.profile.phone || "",
              location: result.user.profile.location || "",
              website: result.user.profile.website || "",
              timezone: result.user.profile.timezone || "UTC",
              language: result.user.profile.language || "en",
              emailNotifications: result.user.profile.emailNotifications,
              marketingEmails: result.user.profile.marketingEmails,
            }),
          }));
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateProfileAction(formData);

      if (!result.success) {
        setError(result.error || "Failed to update profile");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
          Profile updated successfully
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows={3}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.bio.length}/500 characters
        </p>
      </div>

      {/* Phone & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium mb-2">Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Timezone & Language */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">GMT</option>
            <option value="Europe/Paris">CET</option>
            <option value="Asia/Tokyo">JST</option>
            <option value="Australia/Sydney">AEDT</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-3 pt-4 border-t">
        <h3 className="font-medium">Notification Preferences</h3>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Email me about account activity</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="marketingEmails"
            checked={formData.marketingEmails}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Send me marketing and feature updates</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
