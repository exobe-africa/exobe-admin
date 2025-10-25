"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAdmin } from '../context/AdminContext';
import StatCard from '../components/common/StatCard';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useDashboardStore } from '../store';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

export default function HomePage() {
  const { admin } = useAdmin();
  const router = useRouter();
  const { stats, recentOrders, isLoading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function centsToRand(cents: number): string {
    const rands = (cents || 0) / 100;
    return `R ${rands.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  }

  const orderColumns = [
    { key: 'order_number', label: 'Order #', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    {
      key: 'amount_cents',
      label: 'Total',
      sortable: true,
      render: (order: any) => centsToRand(order.amount_cents),
    },
    {
      key: 'items_count',
      label: 'Items',
      sortable: true,
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (order: any) => {
        const status = String(order.status || '').toUpperCase();
        const variant = status === 'FULFILLED' ? 'success' :
                       status === 'SHIPPED' ? 'info' :
                       status === 'PROCESSING' ? 'warning' :
                       status === 'CANCELLED' ? 'danger' : 'neutral';
        const label = status === 'FULFILLED' ? 'Delivered' :
                     status === 'SHIPPED' ? 'Shipped' :
                     status === 'PROCESSING' ? 'Processing' :
                     status === 'CANCELLED' ? 'Cancelled' : 'Pending';
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'payment_status',
      label: 'PAYMENT',
      render: (order: any) => {
        const ps = String(order.payment_status || '').toUpperCase();
        const variant = ps === 'PAID' ? 'success' : ps === 'REFUNDED' ? 'warning' : 'warning';
        const label = ps.charAt(0) + ps.slice(1).toLowerCase();
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
  ];

  if (isLoading && !stats) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

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
            value={formatNumber(stats?.totalUsers || 0)}
            icon={Users}
            trend={{ value: stats?.usersTrend || 0, isPositive: (stats?.usersTrend || 0) >= 0 }}
            color="blue"
          />
          <StatCard
            title="Active Vendors"
            value={formatNumber(stats?.activeVendors || 0)}
            icon={Store}
            trend={{ value: stats?.vendorsTrend || 0, isPositive: (stats?.vendorsTrend || 0) >= 0 }}
            color="purple"
          />
          <StatCard
            title="Total Products"
            value={formatNumber(stats?.totalProducts || 0)}
            icon={Package}
            trend={{ value: stats?.productsTrend || 0, isPositive: (stats?.productsTrend || 0) >= 0 }}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(stats?.totalOrders || 0)}
            icon={ShoppingCart}
            trend={{ value: stats?.ordersTrend || 0, isPositive: (stats?.ordersTrend || 0) >= 0 }}
            color="orange"
          />
          <StatCard
            title="Revenue"
            value={centsToRand(stats?.revenueCents || 0)}
            icon={DollarSign}
            trend={{ value: stats?.revenueTrend || 0, isPositive: (stats?.revenueTrend || 0) >= 0 }}
            color="green"
          />
          <StatCard
            title="Growth Rate"
            value={`${(stats?.growthRate || 0).toFixed(1)}%`}
            icon={TrendingUp}
            trend={{ value: stats?.growthRate || 0, isPositive: (stats?.growthRate || 0) >= 0 }}
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
            <button 
              onClick={() => router.push('/orders')}
              className="text-[#C8102E] hover:text-[#a00d25] font-medium text-sm"
            >
              View All →
            </button>
          </div>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            keyExtractor={(order) => order.id}
            pageSize={5}
            onRowClick={(order) => router.push(`/orders/${order.id}`)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
