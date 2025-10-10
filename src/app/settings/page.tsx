"use client";

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { Settings, Save, User, Bell, Shield, Globe, Mail } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function SettingsPage() {
  const { showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'eXobe Platform',
    siteEmail: 'admin@exobe.co.za',
    supportEmail: 'support@exobe.co.za',
    timezone: 'Africa/Johannesburg',
    currency: 'ZAR',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    vendorNotifications: true,
    systemNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  });

  const handleSaveGeneral = () => {
    showSuccess('General settings saved successfully');
  };

  const handleSaveNotifications = () => {
    showSuccess('Notification settings saved successfully');
  };

  const handleSaveSecurity = () => {
    showSuccess('Security settings saved successfully');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage platform settings and configurations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#C8102E] text-[#C8102E]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <Input
                      label="Site Name"
                      value={generalSettings.siteName}
                      onChange={(value) => setGeneralSettings({ ...generalSettings, siteName: value })}
                      fullWidth
                    />
                    <Input
                      label="Site Email"
                      type="email"
                      value={generalSettings.siteEmail}
                      onChange={(value) => setGeneralSettings({ ...generalSettings, siteEmail: value })}
                      icon={Mail}
                      fullWidth
                    />
                    <Input
                      label="Support Email"
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(value) => setGeneralSettings({ ...generalSettings, supportEmail: value })}
                      icon={Mail}
                      fullWidth
                    />
                    <Select
                      label="Timezone"
                      value={generalSettings.timezone}
                      onChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                      options={[
                        { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (SAST)' },
                        { value: 'UTC', label: 'UTC' },
                        { value: 'America/New_York', label: 'America/New York (EST)' },
                      ]}
                      fullWidth
                    />
                    <Select
                      label="Currency"
                      value={generalSettings.currency}
                      onChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                      options={[
                        { value: 'ZAR', label: 'South African Rand (ZAR)' },
                        { value: 'USD', label: 'US Dollar (USD)' },
                        { value: 'EUR', label: 'Euro (EUR)' },
                      ]}
                      fullWidth
                    />
                  </div>
                  <div className="mt-6">
                    <Button icon={Save} onClick={handleSaveGeneral}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'orderNotifications', label: 'Order Notifications', description: 'Get notified about new orders' },
                      { key: 'userNotifications', label: 'User Notifications', description: 'Get notified about new user registrations' },
                      { key: 'vendorNotifications', label: 'Vendor Notifications', description: 'Get notified about vendor applications' },
                      { key: 'systemNotifications', label: 'System Notifications', description: 'Get notified about system updates' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{setting.label}</p>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [setting.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8102E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8102E]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button icon={Save} onClick={handleSaveNotifications}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8102E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8102E]"></div>
                      </label>
                    </div>
                    <Select
                      label="Session Timeout (minutes)"
                      value={securitySettings.sessionTimeout}
                      onChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                      options={[
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 hour' },
                        { value: '120', label: '2 hours' },
                      ]}
                      fullWidth
                    />
                    <Select
                      label="Password Expiry (days)"
                      value={securitySettings.passwordExpiry}
                      onChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}
                      options={[
                        { value: '30', label: '30 days' },
                        { value: '60', label: '60 days' },
                        { value: '90', label: '90 days' },
                        { value: 'never', label: 'Never' },
                      ]}
                      fullWidth
                    />
                  </div>
                  <div className="mt-6">
                    <Button icon={Save} onClick={handleSaveSecurity}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-3xl font-bold">
                        A
                      </div>
                      <Button variant="secondary">Change Avatar</Button>
                    </div>
                    <Input
                      label="Full Name"
                      value="Admin User"
                      onChange={() => {}}
                      fullWidth
                    />
                    <Input
                      label="Email"
                      type="email"
                      value="admin@exobe.co.za"
                      onChange={() => {}}
                      icon={Mail}
                      fullWidth
                    />
                    <Input
                      label="Current Password"
                      type="password"
                      value=""
                      onChange={() => {}}
                      fullWidth
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value=""
                      onChange={() => {}}
                      fullWidth
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value=""
                      onChange={() => {}}
                      fullWidth
                    />
                  </div>
                  <div className="mt-6">
                    <Button icon={Save}>
                      Update Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

