"use client";

import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { CheckCircle, XCircle, Edit, Save } from 'lucide-react';
import SellerApplicationDetails from './SellerApplicationDetails';
import ServiceProviderApplicationDetails from './ServiceProviderApplicationDetails';

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  activeTab: 'seller' | 'service-provider';
  selectedApplication: any;
  editedApplication: any;
  isEditing: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
  onFieldChange: (field: string, value: any) => void;
}

export default function ApplicationDetailsModal({
  isOpen,
  activeTab,
  selectedApplication,
  editedApplication,
  isEditing,
  onClose,
  onEdit,
  onSave,
  onCancel,
  onApprove,
  onReject,
  onFieldChange,
}: ApplicationDetailsModalProps) {
  if (!selectedApplication) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Details"
      size="2xl"
      footer={activeTab === 'seller' && (
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3">
            {selectedApplication.status === 'PENDING' && !isEditing && (
              <>
                <Button
                  icon={CheckCircle}
                  onClick={() => {
                    onApprove(selectedApplication.id);
                    onClose();
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  icon={XCircle}
                  onClick={() => {
                    onReject(selectedApplication.id);
                    onClose();
                  }}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
                <Button icon={Save} onClick={onSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              selectedApplication.status === 'PENDING' && (
                <Button icon={Edit} onClick={onEdit}>
                  Edit Application
                </Button>
              )
            )}
          </div>
        </div>
      )}
    >
      {activeTab === 'seller' && editedApplication ? (
        <SellerApplicationDetails
          selectedApplication={selectedApplication}
          editedApplication={editedApplication}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
        />
      ) : (
        <ServiceProviderApplicationDetails
          selectedApplication={selectedApplication}
          onApprove={onApprove}
          onReject={onReject}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

