"use client";

import Select from '../../common/Select';
import Button from '../../common/Button';
import { Save } from 'lucide-react';
import { useSettingsStore } from '../../../store/settings';
import { useToast } from '../../../context/ToastContext';

export default function SecuritySettings() {
  const { securitySettings, setSecuritySettings, saveSecuritySettings, isLoading } = useSettingsStore();
  const { showSuccess, showError } = useToast();

  const handleSave = async () => {
    try {
      await saveSecuritySettings();
      showSuccess('Security settings saved successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to save security settings');
    }
  };

  return (
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
                onChange={(e) => setSecuritySettings({ twoFactorAuth: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8102E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8102E]"></div>
            </label>
          </div>
          <Select
            label="Session Timeout (minutes)"
            value={securitySettings.sessionTimeout}
            onChange={(value) => setSecuritySettings({ sessionTimeout: value })}
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
            onChange={(value) => setSecuritySettings({ passwordExpiry: value })}
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
          <Button icon={Save} onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

