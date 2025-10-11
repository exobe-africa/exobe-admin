"use client";

import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { CheckCircle, XCircle, Edit, Save } from 'lucide-react';
import PersonalInfoSection from './application-sections/PersonalInfoSection';
import BusinessInfoSection from './application-sections/BusinessInfoSection';
import VATFinancialSection from './application-sections/VATFinancialSection';
import PhysicalStoresSection from './application-sections/PhysicalStoresSection';
import AddressSection from './application-sections/AddressSection';
import ProductsInventorySection from './application-sections/ProductsInventorySection';
import OnlinePresenceSection from './application-sections/OnlinePresenceSection';
import AdditionalInfoSection from './application-sections/AdditionalInfoSection';

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  application: any;
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
  application,
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
  if (!application || !editedApplication) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Details"
      size="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3">
            {application.status === 'PENDING' && !isEditing && (
              <>
                <Button
                  icon={CheckCircle}
                  onClick={() => {
                    onApprove(application.id);
                    onClose();
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  icon={XCircle}
                  onClick={() => {
                    onReject(application.id);
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
              application.status === 'PENDING' && (
                <Button icon={Edit} onClick={onEdit}>
                  Edit Application
                </Button>
              )
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Header with Status */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {editedApplication.first_name} {editedApplication.last_name}
            </h3>
            <p className="text-sm text-gray-600">{editedApplication.email}</p>
          </div>
          <Badge variant={
            application.status === 'APPROVED' ? 'success' :
            application.status === 'REJECTED' ? 'danger' :
            'warning'
          }>
            {application.status}
          </Badge>
        </div>

        <PersonalInfoSection
          data={editedApplication}
          isEditing={isEditing}
          onChange={onFieldChange}
        />

        <BusinessInfoSection
          data={editedApplication}
          isEditing={isEditing}
          onChange={onFieldChange}
        />

        <VATFinancialSection
          data={editedApplication}
          isEditing={isEditing}
          onChange={onFieldChange}
        />

        <PhysicalStoresSection
          data={editedApplication}
          isEditing={isEditing}
          onChange={onFieldChange}
        />

        <AddressSection
          data={editedApplication}
          isEditing={isEditing}
          onChange={onFieldChange}
        />

        <ProductsInventorySection
          data={editedApplication}
          isEditing={isEditing}
          onChange={onFieldChange}
        />

        <OnlinePresenceSection
          data={editedApplication}
          isEditing={isEditing}
          onChange={onFieldChange}
        />

        <AdditionalInfoSection
          data={editedApplication}
          application={application}
          isEditing={isEditing}
          onChange={onFieldChange}
        />
      </div>
    </Modal>
  );
}

