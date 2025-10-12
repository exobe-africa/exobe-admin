"use client";

import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import { Mail, Save } from 'lucide-react';
import { useSettingsStore } from '../../../store/settings';
import { useToast } from '../../../context/ToastContext';

export default function GeneralSettings() {
  const { generalSettings, setGeneralSettings, saveGeneralSettings, isLoading } = useSettingsStore();
  const { showSuccess, showError } = useToast();

  const handleSave = async () => {
    try {
      await saveGeneralSettings();
      showSuccess('General settings saved successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to save general settings');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <Input
            label="Site Name"
            value={generalSettings.siteName}
            onChange={(value) => setGeneralSettings({ siteName: value })}
            fullWidth
          />
          <Input
            label="Site Email"
            type="email"
            value={generalSettings.siteEmail}
            onChange={(value) => setGeneralSettings({ siteEmail: value })}
            icon={Mail}
            fullWidth
          />
          <Input
            label="Support Email"
            type="email"
            value={generalSettings.supportEmail}
            onChange={(value) => setGeneralSettings({ supportEmail: value })}
            icon={Mail}
            fullWidth
          />
          <Select
            label="Timezone"
            value={generalSettings.timezone}
            onChange={(value) => setGeneralSettings({ timezone: value })}
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
            onChange={(value) => setGeneralSettings({ currency: value })}
            options={[
              { value: 'ZAR', label: 'South African Rand (ZAR)' },
              { value: 'USD', label: 'US Dollar (USD)' },
              { value: 'EUR', label: 'Euro (EUR)' },
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

