"use client";

import type { VendorStats } from '../../store/vendors';

interface VendorsStatsProps {
  stats: VendorStats | null;
}

export default function VendorsStats({ stats }: VendorsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Total Vendors</p>
        <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Active Vendors</p>
        <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
        <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Total Products</p>
        <p className="text-2xl font-bold text-blue-600">{stats?.totalProducts || 0}</p>
      </div>
    </div>
  );
}


