"use client";

import { MapPin, CreditCard } from 'lucide-react';

export default function OrderAddressCard({ title, icon, address }: { title: string; icon: 'shipping' | 'billing'; address: any }) {
  const Icon = icon === 'shipping' ? MapPin : CreditCard;
  if (!address) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon className="text-[#C8102E]" size={20} />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-1 text-gray-900">
          {address.street && <p>{address.street}</p>}
          {address.suburb && <p>{address.suburb}</p>}
          <p>
            {address.city}
            {address.province && `, ${address.province}`}
          </p>
          {address.postal_code && <p>{address.postal_code}</p>}
          {address.country && <p>{address.country}</p>}
        </div>
      </div>
    </div>
  );
}


