"use client";

import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { CheckCircle, XCircle } from 'lucide-react';

interface ServiceProviderApplicationDetailsProps {
  selectedApplication: any;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
  onClose: () => void;
}

export default function ServiceProviderApplicationDetails({
  selectedApplication,
  onApprove,
  onReject,
  onClose,
}: ServiceProviderApplicationDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">First Name</p>
          <p className="font-medium text-gray-900">{selectedApplication.first_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Last Name</p>
          <p className="font-medium text-gray-900">{selectedApplication.last_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Email</p>
          <p className="font-medium text-gray-900">{selectedApplication.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Phone</p>
          <p className="font-medium text-gray-900">{selectedApplication.phone || 'Not provided'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-600 mb-1">Primary Service</p>
          <p className="font-medium text-gray-900">{selectedApplication.primary_service}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Status</p>
          <Badge variant={
            selectedApplication.status === 'APPROVED' ? 'success' :
            selectedApplication.status === 'REJECTED' ? 'danger' :
            'warning'
          }>
            {selectedApplication.status}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Applied</p>
          <p className="font-medium text-gray-900">
            {new Date(selectedApplication.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {selectedApplication.status === 'PENDING' && (
        <div className="border-t pt-4">
          <h4 className="font-bold text-gray-900 mb-3">Actions</h4>
          <div className="flex gap-3">
            <Button
              icon={CheckCircle}
              onClick={() => {
                onApprove(selectedApplication.id);
                onClose();
              }}
            >
              Approve Application
            </Button>
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => {
                onReject(selectedApplication.id);
                onClose();
              }}
            >
              Reject Application
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

