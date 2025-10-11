"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore, AdminUser } from '../store/auth';

interface AdminContextType {
  admin: AdminUser | null;
  isLoggedIn: boolean;
  login: (adminData: AdminUser) => void;
  logout: () => Promise<void>;
  updateAdmin: (adminData: Partial<AdminUser>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore();

  // Sync cookies on mount and when user changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user && isAuthenticated) {
      // Set cookie for middleware authentication
      if (user.token) {
        document.cookie = `exobeAdminToken=${user.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      }
      if (user.role) {
        document.cookie = `exobeAdminRole=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
    }
  }, [user, isAuthenticated]);

  const login = (adminData: AdminUser) => {
    // This is now handled by the Zustand store, but kept for backward compatibility
    // The actual login should use useAuthStore().login() directly
    if (typeof window !== 'undefined') {
      // Set cookies
      if (adminData.token) {
        document.cookie = `exobeAdminToken=${adminData.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      if (adminData.role) {
        document.cookie = `exobeAdminRole=${adminData.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
    }
  };

  const logout = async () => {
    await storeLogout();
    
    if (typeof window !== 'undefined') {
      // Clear authentication cookies
      document.cookie = 'exobeAdminToken=; path=/; max-age=0';
      document.cookie = 'exobeAdminRole=; path=/; max-age=0';
      
      // Redirect to login
      window.location.href = '/auth/login';
    }
  };

  const updateAdmin = (adminData: Partial<AdminUser>) => {
    // This would need to be implemented in the Zustand store if needed
    // For now, kept for backward compatibility
    console.warn('updateAdmin is deprecated, use Zustand store directly');
  };

  return (
    <AdminContext.Provider value={{
      admin: user,
      isLoggedIn: isAuthenticated,
      login,
      logout,
      updateAdmin
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
