"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  FileText,
  MessagesSquare,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAdmin } from '../../context/AdminContext';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
  { label: 'Users', icon: <Users size={20} />, href: '/users' },
  { label: 'Vendors', icon: <Store size={20} />, href: '/vendors' },
  { label: 'Products', icon: <Package size={20} />, href: '/products' },
  { label: 'Orders', icon: <ShoppingCart size={20} />, href: '/orders' },
  { label: 'Analytics', icon: <BarChart3 size={20} />, href: '/analytics' },
  { label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { label: 'Messages', icon: <MessagesSquare size={20} />, href: '/messages' },
  { label: 'Notifications', icon: <Bell size={20} />, href: '/notifications' },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUI();
  const { admin, logout } = useAdmin();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#1a1a1a] text-white transition-all duration-300 z-40 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          {!isSidebarCollapsed ? (
            <div className="flex items-center">
              <Image 
                src="/exobe-logo.png" 
                alt="eXobe Logo" 
                width={120} 
                height={48}
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <Image 
                src="/exobe-logo.png" 
                alt="eXobe Logo" 
                width={40} 
                height={40}
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          )}
          {!isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Collapse button when sidebar is collapsed */}
        {isSidebarCollapsed && (
          <div className="px-3 py-2">
            <button
              onClick={toggleSidebar}
              className="w-full p-2 rounded-lg hover:bg-[#2a2a2a] transition-colors flex justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#C8102E] text-white'
                        : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                    } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isSidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && item.badge && (
                      <span className="ml-auto bg-[#C8102E] text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center font-bold">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{admin?.role || 'Administrator'}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center font-bold">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600/10 hover:text-red-500 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

