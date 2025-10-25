"use client";

import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactProps {
  email?: string | null;
  phone?: string | null;
}

export function VendorContact({ email, phone }: ContactProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
      <div className="space-y-4">
        {email && (
          <div className="flex items-start gap-3">
            <Mail className="text-gray-400 mt-1 flex-shrink-0" size={18} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">Email</p>
              <a href={`mailto:${email}`} className="text-[#C8102E] hover:underline break-all">{email}</a>
            </div>
          </div>
        )}
        {phone && (
          <div className="flex items-start gap-3">
            <Phone className="text-gray-400 mt-1 flex-shrink-0" size={18} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">Phone</p>
              <a href={`tel:${phone}`} className="text-gray-900 hover:text-[#C8102E]">{phone}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AddressProps {
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export function VendorAddress({ address, city, province, postalCode, country }: AddressProps) {
  if (!(address || city)) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-gray-400" size={20} />
        <h2 className="text-xl font-bold text-gray-900">Address</h2>
      </div>
      <div className="text-gray-900 space-y-1">
        {address && <p>{address}</p>}
        {city && <p>{city}{province && `, ${province}`}</p>}
        {postalCode && <p>{postalCode}</p>}
        {country && <p>{country}</p>}
      </div>
    </div>
  );
}


