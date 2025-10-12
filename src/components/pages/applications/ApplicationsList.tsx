"use client";

import DataTable from '../../common/DataTable';
import Badge from '../../common/Badge';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationsListProps {
  applications: any[];
  activeTab: 'seller' | 'service-provider';
  onView: (application: any) => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

export default function ApplicationsList({
  applications,
  activeTab,
  onView,
  onApprove,
  onReject,
}: ApplicationsListProps) {
  const columns = [
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true, cellClassName: 'max-w-[220px] truncate' },
    { key: 'phone', label: 'Phone', sortable: true },
    {
      key: activeTab === 'seller' ? 'business_name' : 'primary_service',
      label: activeTab === 'seller' ? 'Business' : 'Service',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (app: any) => (
        <Badge variant={
          app.status === 'APPROVED' ? 'success' :
          app.status === 'REJECTED' ? 'danger' :
          app.status === 'PENDING' ? 'warning' :
          'neutral'
        }>
          {app.status}
        </Badge>
      ),
    },
    { key: 'created_at', label: 'Applied', sortable: true, cellClassName: 'whitespace-nowrap' },
    {
      key: 'actions',
      label: 'Actions',
      render: (app: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(app)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {app.status === 'PENDING' && (
            <>
              <button
                onClick={() => onApprove(app.id)}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                title="Approve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => onReject(app.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={applications}
      keyExtractor={(app) => app.id}
      emptyMessage={`No ${activeTab === 'seller' ? 'seller' : 'service provider'} applications found`}
    />
  );
}

