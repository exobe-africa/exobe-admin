"use client";

import Button from '../common/Button';
import Badge from '../common/Badge';
import { ArrowLeft, Store, Ban, CheckCircle } from 'lucide-react';

interface VendorHeaderProps {
  vendor: {
    id: string;
    name: string;
    status: string;
    sellerType?: string;
  };
  onBack: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSuspend?: () => void;
  onReactivate?: () => void;
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

export default function VendorHeader({ vendor, onBack, onApprove, onReject, onSuspend, onReactivate }: VendorHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onBack} className="!p-2">
          <ArrowLeft size={20} />
        </Button>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C8102E] to-[#a00d24] flex items-center justify-center text-white shadow-lg">
          <Store size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant={getStatusColor(vendor.status) as any}>{vendor.status}</Badge>
            {vendor.sellerType && <span className="text-sm text-gray-500">{vendor.sellerType}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        {vendor.status === 'PENDING' && (
          <>
            <Button variant="primary" onClick={onApprove}>
              <CheckCircle size={18} />
              Approve Vendor
            </Button>
            <Button variant="danger" onClick={onReject}>
              <Ban size={18} />
              Reject
            </Button>
          </>
        )}
        {vendor.status === 'APPROVED' && (
          <Button variant="danger" onClick={onSuspend}>
            <Ban size={18} />
            Suspend Vendor
          </Button>
        )}
        {vendor.status === 'SUSPENDED' && (
          <Button variant="primary" onClick={onReactivate}>
            <CheckCircle size={18} />
            Reactivate Vendor
          </Button>
        )}
      </div>
    </div>
  );
}


