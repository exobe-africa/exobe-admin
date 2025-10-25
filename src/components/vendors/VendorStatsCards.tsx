"use client";

import { Package, DollarSign, Box, Calendar } from 'lucide-react';

interface VendorStatsCardsProps {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  inventoryValue: string;
  createdAt: string;
}

export default function VendorStatsCards({ totalProducts, activeProducts, draftProducts, archivedProducts, inventoryValue, createdAt }: VendorStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Total Products</p>
          <Package className="text-blue-500" size={20} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
        <p className="text-xs text-gray-500 mt-1">{activeProducts} active</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Est. Inventory Value</p>
          <DollarSign className="text-green-500" size={20} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{inventoryValue}</p>
        <p className="text-xs text-gray-500 mt-1">Based on stock</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Draft Products</p>
          <Box className="text-yellow-500" size={20} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{draftProducts}</p>
        <p className="text-xs text-gray-500 mt-1">{archivedProducts} archived</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Member Since</p>
          <Calendar className="text-purple-500" size={20} />
        </div>
        <p className="text-lg font-bold text-gray-900">{createdAt}</p>
      </div>
    </div>
  );
}


