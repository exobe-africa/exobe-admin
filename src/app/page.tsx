"use client";

import DashboardLayout from '../components/layout/DashboardLayout';
import { useAdmin } from '../context/AdminContext';
import StatCard from '../components/common/StatCard';
import DataTable from '../components/common/DataTable';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart,
  TrendingUp,
  DollarSign
} from 'lucide-react';

// Mock data for demonstration
const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', product: 'Premium Headphones', amount: 'R 1,299', status: 'Completed', date: '2025-10-10' },
  { id: 'ORD-002', customer: 'Jane Smith', product: 'Wireless Mouse', amount: 'R 499', status: 'Processing', date: '2025-10-10' },
  { id: 'ORD-003', customer: 'Mike Johnson', product: 'Laptop Stand', amount: 'R 899', status: 'Pending', date: '2025-10-09' },
  { id: 'ORD-004', customer: 'Sarah Williams', product: 'USB-C Hub', amount: 'R 649', status: 'Completed', date: '2025-10-09' },
  { id: 'ORD-005', customer: 'Tom Brown', product: 'Mechanical Keyboard', amount: 'R 1,799', status: 'Completed', date: '2025-10-08' },
];

const topProducts = [
  { id: '1', name: 'Premium Headphones', category: 'Electronics', sales: 124, revenue: 'R 161,076' },
  { id: '2', name: 'Wireless Mouse', category: 'Accessories', sales: 98, revenue: 'R 48,902' },
  { id: '3', name: 'Laptop Stand', category: 'Office', sales: 87, revenue: 'R 78,213' },
  { id: '4', name: 'USB-C Hub', category: 'Electronics', sales: 76, revenue: 'R 49,324' },
  { id: '5', name: 'Mechanical Keyboard', category: 'Accessories', sales: 65, revenue: 'R 116,935' },
];

export default function HomePage() {
  const { admin } = useAdmin();
  const orderColumns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (order: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      )
    },
    { key: 'date', label: 'Date', sortable: true },
  ];

  const productColumns = [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'sales', label: 'Sales', sortable: true },
    { key: 'revenue', label: 'Revenue', sortable: true },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back{admin?.name ? `, ${admin.name}` : ''}! Here's what's happening with your platform today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Total Users"
            value="12,543"
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
            color="blue"
          />
          <StatCard
            title="Active Vendors"
            value="234"
            icon={Store}
            trend={{ value: 8.2, isPositive: true }}
            color="purple"
          />
          <StatCard
            title="Total Products"
            value="8,432"
            icon={Package}
            trend={{ value: 15.3, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value="3,567"
            icon={ShoppingCart}
            trend={{ value: 5.1, isPositive: false }}
            color="orange"
          />
          <StatCard
            title="Revenue"
            value="R 2.4M"
            icon={DollarSign}
            trend={{ value: 18.7, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Growth Rate"
            value="23.5%"
            icon={TrendingUp}
            trend={{ value: 3.2, isPositive: true }}
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart placeholder - Revenue trends</p>
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">User Activity</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart placeholder - User activity trends</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button className="text-[#C8102E] hover:text-[#a00d25] font-medium text-sm">
              View All →
            </button>
          </div>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            keyExtractor={(order) => order.id}
            pageSize={5}
          />
        </div>

        {/* Top Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <button className="text-[#C8102E] hover:text-[#a00d25] font-medium text-sm">
              View All →
            </button>
          </div>
          <DataTable
            columns={productColumns}
            data={topProducts}
            keyExtractor={(product) => product.id}
            pageSize={5}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
