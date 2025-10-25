"use client";

import { User } from 'lucide-react';

export default function OrderCustomerCard({ order }: { order: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <User className="text-[#C8102E]" size={20} />
          <h2 className="text-xl font-bold text-gray-900">Customer</h2>
        </div>
      </div>
      <div className="p-6 space-y-3">
        {order.customer?.first_name && order.customer?.last_name && (
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium text-gray-900">
              {order.customer.first_name} {order.customer.last_name}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium text-gray-900">{order.email}</p>
        </div>
        {(order.customer?.phone || order.customer?.mobile) && (
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium text-gray-900">
              {order.customer.phone || order.customer.mobile}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


