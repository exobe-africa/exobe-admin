"use client";

import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import type { VendorRow } from '../../store/vendors';

interface VendorsTableProps {
  vendors: VendorRow[];
  onView: (vendor: VendorRow) => void;
  onApprove: (vendorId: string) => void;
  onReject: (vendorId: string) => void;
  onSuspend: (vendorId: string) => void;
  onDelete: (vendorId: string) => void;
  onRowClick: (vendor: VendorRow) => void;
}

export default function VendorsTable({ vendors, onView, onApprove, onReject, onSuspend, onDelete, onRowClick }: VendorsTableProps) {
  const columns = [
    { key: 'name', label: 'Vendor Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'products', label: 'Products', sortable: true },
    {
      key: 'status',
      label: 'STATUS',
      render: (vendor: VendorRow) => (
        <Badge variant={
          vendor.status === 'ACTIVE' ? 'success' :
          vendor.status === 'PENDING' ? 'warning' :
          'danger'
        }>
          {vendor.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (vendor: VendorRow) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onView(vendor); }}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          {vendor.status === 'PENDING' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(vendor.id); }}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                title="Approve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(vendor.id); }}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
          {vendor.status === 'ACTIVE' && (
            <button
              onClick={(e) => { e.stopPropagation(); onSuspend(vendor.id); }}
              className="p-2 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors"
              title="Suspend"
            >
              <XCircle size={16} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(vendor.id); }}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={vendors}
      keyExtractor={(v) => v.id}
      emptyMessage="No vendors found"
      onRowClick={onRowClick}
    />
  );
}


