import { create } from 'zustand';
import { getApolloClient } from '../lib/apollo/client';
import { UPDATE_MY_PASSWORD, UPDATE_MY_PROFILE } from '../lib/api/auth';

interface ProfileData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface GeneralSettings {
  siteName: string;
  siteEmail: string;
  supportEmail: string;
  timezone: string;
  currency: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  userNotifications: boolean;
  vendorNotifications: boolean;
  systemNotifications: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
}

interface SettingsState {
  // Profile
  profileData: ProfileData;
  passwordData: PasswordData;
  
  // Settings
  generalSettings: GeneralSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProfileData: (data: Partial<ProfileData>) => void;
  setPasswordData: (data: Partial<PasswordData>) => void;
  setGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  setSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  
  // API Actions
  updateProfile: () => Promise<void>;
  updatePassword: () => Promise<void>;
  saveGeneralSettings: () => Promise<void>;
  saveNotificationSettings: () => Promise<void>;
  saveSecuritySettings: () => Promise<void>;
  
  // Utilities
  clearPasswordFields: () => void;
  clearError: () => void;
  loadUserData: (user: any) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial State
  profileData: {
    name: '',
    email: '',
  },
  passwordData: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  generalSettings: {
    siteName: 'eXobe Platform',
    siteEmail: 'admin@exobe.co.za',
    supportEmail: 'support@exobe.co.za',
    timezone: 'Africa/Johannesburg',
    currency: 'ZAR',
  },
  notificationSettings: {
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    vendorNotifications: true,
    systemNotifications: true,
  },
  securitySettings: {
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  },
  isLoading: false,
  error: null,

  // Setters
  setProfileData: (data) => set((state) => ({ profileData: { ...state.profileData, ...data } })),
  setPasswordData: (data) => set((state) => ({ passwordData: { ...state.passwordData, ...data } })),
  setGeneralSettings: (settings) => set((state) => ({ generalSettings: { ...state.generalSettings, ...settings } })),
  setNotificationSettings: (settings) => set((state) => ({ notificationSettings: { ...state.notificationSettings, ...settings } })),
  setSecuritySettings: (settings) => set((state) => ({ securitySettings: { ...state.securitySettings, ...settings } })),

  // Update Profile
  updateProfile: async () => {
    const { profileData } = get();
    
    if (!profileData.name || !profileData.email) {
      throw new Error('Please fill in all fields');
    }

    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: UPDATE_MY_PROFILE,
        variables: {
          input: {
            first_name: profileData.name.split(' ')[0] || '',
            last_name: profileData.name.split(' ').slice(1).join(' ') || '',
            email: profileData.email,
          },
        },
      });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to update profile', isLoading: false });
      throw error;
    }
  },

  // Update Password
  updatePassword: async () => {
    const { passwordData } = get();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      throw new Error('Please fill in all password fields');
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (passwordData.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: UPDATE_MY_PASSWORD,
        variables: {
          input: {
            current_password: passwordData.currentPassword,
            new_password: passwordData.newPassword,
          },
        },
      });
      set({ isLoading: false });
      get().clearPasswordFields();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update password. Please check your current password.', isLoading: false });
      throw error;
    }
  },

  // Save General Settings
  saveGeneralSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement backend API for general settings
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to save general settings', isLoading: false });
      throw error;
    }
  },

  // Save Notification Settings
  saveNotificationSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement backend API for notification settings
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to save notification settings', isLoading: false });
      throw error;
    }
  },

  // Save Security Settings
  saveSecuritySettings: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement backend API for security settings
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to save security settings', isLoading: false });
      throw error;
    }
  },

  // Utilities
  clearPasswordFields: () => set({
    passwordData: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  }),

  clearError: () => set({ error: null }),

  loadUserData: (user) => {
    if (user) {
      set({
        profileData: {
          name: user.name || '',
          email: user.email || '',
        },
      });
    }
  },
}));

