"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER';
  avatar?: string | null;
  permissions: string[];
  token?: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isLoggedIn: boolean;
  login: (adminData: AdminUser) => void;
  logout: () => void;
  updateAdmin: (adminData: Partial<AdminUser>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAdmin = localStorage.getItem('exobeAdmin');
      
      if (storedAdmin) {
        try {
          const adminData = JSON.parse(storedAdmin);
          setAdmin(adminData);
          setIsLoggedIn(true);
        } catch (error) {
          console.warn('Failed to load admin from localStorage:', error);
        }
      }
    }
  }, []);

  const login = (adminData: AdminUser) => {
    setAdmin(adminData);
    setIsLoggedIn(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('exobeAdmin', JSON.stringify(adminData));
      
      // Set cookie for middleware authentication
      if (adminData.token) {
        document.cookie = `exobeAdminToken=${adminData.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      }
      if (adminData.role) {
        document.cookie = `exobeAdminRole=${adminData.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
    }
  };

  const logout = () => {
    setAdmin(null);
    setIsLoggedIn(false);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('exobeAdmin');
      
      // Clear authentication cookie
      document.cookie = 'exobeAdminToken=; path=/; max-age=0';
      document.cookie = 'exobeAdminRole=; path=/; max-age=0';
      
      // Redirect to login
      window.location.href = '/auth/login';
    }
  };

  const updateAdmin = (adminData: Partial<AdminUser>) => {
    if (admin) {
      const updatedAdmin = { ...admin, ...adminData };
      setAdmin(updatedAdmin);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('exobeAdmin', JSON.stringify(updatedAdmin));
      }
    }
  };

  return (
    <AdminContext.Provider value={{
      admin,
      isLoggedIn,
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

