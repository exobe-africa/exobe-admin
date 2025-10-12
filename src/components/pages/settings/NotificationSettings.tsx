"use client";

import Button from '../../common/Button';
import { Save } from 'lucide-react';
import { useSettingsStore } from '../../../store/settings';
import { useToast } from '../../../context/ToastContext';

export default function NotificationSettings() {
  const { notificationSettings, setNotificationSettings, saveNotificationSettings, isLoading } = useSettingsStore();
  const { showSuccess, showError } = useToast();

  const handleSave = async () => {
    try {
      await saveNotificationSettings();
      showSuccess('Notification settings saved successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to save notification settings');
    }
  };

  const settings = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'orderNotifications', label: 'Order Notifications', description: 'Get notified about new orders' },
    { key: 'userNotifications', label: 'User Notifications', description: 'Get notified about new user registrations' },
    { key: 'vendorNotifications', label: 'Vendor Notifications', description: 'Get notified about vendor applications' },
    { key: 'systemNotifications', label: 'System Notifications', description: 'Get notified about system updates' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                  onChange={(e) => setNotificationSettings({ [setting.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8102E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8102E]"></div>
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button icon={Save} onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

