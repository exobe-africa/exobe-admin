"use client";

import { useEffect } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { Mail, Save, Shield, Lock } from 'lucide-react';
import { useSettingsStore } from '../../../store/settings';
import { useAuthStore } from '../../../store/auth';
import { useToast } from '../../../context/ToastContext';

export default function ProfileSettings() {
  const { user } = useAuthStore();
  const {
    profileData,
    passwordData,
    setProfileData,
    setPasswordData,
    updateProfile,
    updatePassword,
    isLoading,
    loadUserData,
  } = useSettingsStore();
  const { showSuccess, showError } = useToast();

  // Load user data when component mounts or user changes
  useEffect(() => {
    loadUserData(user);
  }, [user, loadUserData]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile();
      showSuccess('Profile updated successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword();
      showSuccess('Password updated successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to update password');
    }
  };

  const passwordsMatch = passwordData.newPassword && passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword;

  const isPasswordTooShort = passwordData.newPassword && passwordData.newPassword.length < 8;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Information */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-3xl font-bold">
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <Button variant="secondary">Change Avatar</Button>
          </div>
          <Input
            label="Full Name"
            value={profileData.name}
            onChange={(value) => setProfileData({ name: value })}
            fullWidth
            required
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(value) => setProfileData({ email: value })}
            icon={Mail}
            fullWidth
            required
          />
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Shield className="text-blue-600" size={18} />
            <p className="text-sm text-blue-900">
              <strong>Role:</strong> {user?.role || 'ADMIN'}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Button
            icon={Save}
            onClick={handleUpdateProfile}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </div>

      {/* Password Update Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(value) => setPasswordData({ currentPassword: value })}
            icon={Lock}
            fullWidth
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(value) => setPasswordData({ newPassword: value })}
            icon={Lock}
            fullWidth
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(value) => setPasswordData({ confirmPassword: value })}
            icon={Lock}
            fullWidth
            required
          />
          {passwordData.newPassword && passwordData.confirmPassword && (
            <div className="flex items-center gap-2 text-sm">
              {passwordsMatch ? (
                <p className="text-green-600">✓ Passwords match</p>
              ) : (
                <p className="text-red-600">✗ Passwords do not match</p>
              )}
            </div>
          )}
          {isPasswordTooShort && (
            <p className="text-sm text-red-600">Password must be at least 8 characters long</p>
          )}
        </div>
        <div className="mt-6">
          <Button
            icon={Lock}
            onClick={handleUpdatePassword}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>
    </div>
  );
}

