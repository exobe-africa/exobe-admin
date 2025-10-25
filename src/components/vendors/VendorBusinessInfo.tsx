"use client";

import Badge from '../common/Badge';

interface VendorBusinessInfoProps {
  name: string;
  sellerType?: string;
  status: string;
  isActive: boolean;
  description?: string | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'SUSPENDED':
      return 'danger';
    default:
      return 'secondary';
  }
}

export default function VendorBusinessInfo({ name, sellerType, status, isActive, description }: VendorBusinessInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Business Name</p>
          <p className="font-medium text-gray-900">{name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Seller Type</p>
          <p className="font-medium text-gray-900">{sellerType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Status</p>
          <Badge variant={getStatusColor(status) as any}>{status}</Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Account Active</p>
          <Badge variant={isActive ? 'success' : 'danger'}>
            {isActive ? 'Yes' : 'No'}
          </Badge>
        </div>
        {description && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-gray-900">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}


