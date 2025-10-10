"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const UIContext = createContext<UIState | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <UIContext.Provider
      value={{
        isSidebarCollapsed,
        isMobileMenuOpen,
        setSidebarCollapsed: setIsSidebarCollapsed,
        setMobileMenuOpen: setIsMobileMenuOpen,
        toggleSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

