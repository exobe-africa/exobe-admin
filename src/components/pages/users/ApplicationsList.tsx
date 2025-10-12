"use client";

import DataTable from '../../common/DataTable';
import Badge from '../../common/Badge';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationsListProps {
  applications: any[];
  searchQuery: string;
  onView: (application: any) => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
  onOpenRejectionModal: (applicationId: string) => void;
}

export default function ApplicationsList({
  applications,
  searchQuery,
  onView,
  onApprove,
  onReject,
  onOpenRejectionModal,
}: ApplicationsListProps) {
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (app.first_name + ' ' + app.last_name).toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      (app.business_name || app.primary_service).toLowerCase().includes(query)
    );
  });

  const columns = [
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    {
      key: 'business_name',
      label: 'Business',
      sortable: true,
      render: (app: any) => app.business_name || app.primary_service,
    },
    {
      key: 'status',
      label: 'Status',
      render: (app: any) => (
        <Badge variant={
          app.status === 'APPROVED' ? 'success' :
          app.status === 'REJECTED' ? 'danger' :
          'warning'
        }>
          {app.status}
        </Badge>
      ),
    },
    { key: 'created_at', label: 'Applied', sortable: true },
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
                onClick={() => onOpenRejectionModal(app.id)}
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
      data={filteredApplications}
      keyExtractor={(app) => app.id}
      emptyMessage="No applications found"
    />
  );
}

