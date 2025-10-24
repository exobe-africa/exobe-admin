"use client";

interface OrdersStatsProps {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
}

export default function OrdersStats({ total, pending, processing, shipped, delivered }: OrdersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Total Orders</p>
        <p className="text-2xl font-bold text-gray-900">{total}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Pending</p>
        <p className="text-2xl font-bold text-gray-600">{pending}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Processing</p>
        <p className="text-2xl font-bold text-yellow-600">{processing}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Shipped</p>
        <p className="text-2xl font-bold text-blue-600">{shipped}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Delivered</p>
        <p className="text-2xl font-bold text-green-600">{delivered}</p>
      </div>
    </div>
  );
}


