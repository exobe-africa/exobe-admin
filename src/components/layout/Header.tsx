"use client";

import { Search, Menu, Bell, User } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAdmin } from '../../context/AdminContext';

export default function Header() {
  const { isSidebarCollapsed, setMobileMenuOpen } = useUI();
  const { admin } = useAdmin();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4 flex-1">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users, vendors, products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C8102E] rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{admin?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{admin?.role || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

