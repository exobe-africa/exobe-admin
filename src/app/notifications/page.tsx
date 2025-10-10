"use client";

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Bell, Check, Trash2, ShoppingCart, Users, Package, Store } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', title: 'New Order Placed', message: 'Order #ORD-2025-007 has been placed', time: '5 minutes ago', read: false },
    { id: 2, type: 'user', title: 'New User Registration', message: 'David Wilson has registered an account', time: '15 minutes ago', read: false },
    { id: 3, type: 'product', title: 'Low Stock Alert', message: 'Bluetooth Speaker is running low on stock (5 units)', time: '1 hour ago', read: false },
    { id: 4, type: 'vendor', title: 'Vendor Application', message: 'New vendor application from Beauty Products Co.', time: '2 hours ago', read: true },
    { id: 5, type: 'order', title: 'Order Delivered', message: 'Order #ORD-2025-004 has been delivered', time: '3 hours ago', read: true },
    { id: 6, type: 'product', title: 'Product Published', message: 'New product "Gaming Headset" has been published', time: '5 hours ago', read: true },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="text-blue-600" size={20} />;
      case 'user':
        return <Users className="text-green-600" size={20} />;
      case 'product':
        return <Package className="text-purple-600" size={20} />;
      case 'vendor':
        return <Store className="text-orange-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with platform activities</p>
          </div>
          {unreadCount > 0 && (
            <Button icon={Check} variant="secondary" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Notifications</p>
            <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Unread</p>
            <p className="text-2xl font-bold text-[#C8102E]">{unreadCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Read</p>
            <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 flex items-start gap-4 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'order' ? 'bg-blue-100' :
                    notification.type === 'user' ? 'bg-green-100' :
                    notification.type === 'product' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="info" size="sm">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

