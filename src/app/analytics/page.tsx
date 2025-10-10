"use client";

import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Select from '../../components/common/Select';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  Store,
  Calendar,
  Download
} from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/common/Button';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
            <p className="text-gray-600">Track performance metrics and business insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onChange={setTimeRange}
              options={[
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '90days', label: 'Last 90 Days' },
                { value: '1year', label: 'Last Year' },
              ]}
            />
            <Button icon={Download} variant="secondary">
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="R 2.4M"
            icon={DollarSign}
            trend={{ value: 18.7, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value="3,567"
            icon={ShoppingCart}
            trend={{ value: 12.3, isPositive: true }}
            color="blue"
          />
          <StatCard
            title="New Customers"
            value="1,234"
            icon={Users}
            trend={{ value: 8.5, isPositive: true }}
            color="purple"
          />
          <StatCard
            title="Avg. Order Value"
            value="R 673"
            icon={TrendingUp}
            trend={{ value: 5.2, isPositive: true }}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 text-green-600" size={48} />
                <p className="text-gray-600">Revenue chart visualization</p>
                <p className="text-sm text-gray-500 mt-1">Chart library integration needed</p>
              </div>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Volume</h2>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <ShoppingCart className="mx-auto mb-2 text-blue-600" size={48} />
                <p className="text-gray-600">Orders chart visualization</p>
                <p className="text-sm text-gray-500 mt-1">Chart library integration needed</p>
              </div>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">User Growth</h2>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-center">
                <Users className="mx-auto mb-2 text-purple-600" size={48} />
                <p className="text-gray-600">User growth chart visualization</p>
                <p className="text-sm text-gray-500 mt-1">Chart library integration needed</p>
              </div>
            </div>
          </div>

          {/* Product Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Product Performance</h2>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
              <div className="text-center">
                <Package className="mx-auto mb-2 text-orange-600" size={48} />
                <p className="text-gray-600">Product metrics visualization</p>
                <p className="text-sm text-gray-500 mt-1">Chart library integration needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              {[
                { name: 'Electronics', value: 'R 845K', percentage: 35 },
                { name: 'Fashion', value: 'R 623K', percentage: 26 },
                { name: 'Home & Living', value: 'R 487K', percentage: 20 },
                { name: 'Sports', value: 'R 356K', percentage: 15 },
                { name: 'Others', value: 'R 89K', percentage: 4 },
              ].map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-bold text-gray-900">{category.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#C8102E] h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Vendors</h3>
            <div className="space-y-4">
              {[
                { name: 'Tech Solutions SA', revenue: 'R 234K', orders: 145 },
                { name: 'Fashion Hub', revenue: 'R 198K', orders: 123 },
                { name: 'Home & Living', revenue: 'R 176K', orders: 98 },
                { name: 'Sports World', revenue: 'R 145K', orders: 87 },
                { name: 'Beauty Box', revenue: 'R 123K', orders: 76 },
              ].map((vendor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendor.name}</p>
                      <p className="text-xs text-gray-500">{vendor.orders} orders</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">{vendor.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New order placed', time: '2 minutes ago', type: 'order' },
                { action: 'New user registered', time: '15 minutes ago', type: 'user' },
                { action: 'Product published', time: '1 hour ago', type: 'product' },
                { action: 'Vendor approved', time: '2 hours ago', type: 'vendor' },
                { action: 'Order delivered', time: '3 hours ago', type: 'order' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'order' ? 'bg-blue-100' :
                    activity.type === 'user' ? 'bg-green-100' :
                    activity.type === 'product' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'order' && <ShoppingCart size={14} className="text-blue-600" />}
                    {activity.type === 'user' && <Users size={14} className="text-green-600" />}
                    {activity.type === 'product' && <Package size={14} className="text-purple-600" />}
                    {activity.type === 'vendor' && <Store size={14} className="text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

