"use client";

import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import { XCircle } from 'lucide-react';
import { useApplicationsStore } from '../../../store/applications';
import { useToast } from '../../../context/ToastContext';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | null;
}

export default function RejectionModal({ isOpen, onClose, applicationId }: RejectionModalProps) {
  const { rejectionData, setRejectionData, rejectApplicationWithReason, isRejecting, rejectionApplicationId } = useApplicationsStore();
  const { showSuccess, showError } = useToast();

  const idToUse = applicationId || rejectionApplicationId;

  const rejectionTypes = [
    { value: 'INCOMPLETE_APPLICATION', label: 'Incomplete Application' },
    { value: 'INSUFFICIENT_BUSINESS_INFO', label: 'Insufficient Business Information' },
    { value: 'INVALID_DOCUMENTATION', label: 'Invalid Documentation' },
    { value: 'BUSINESS_TYPE_MISMATCH', label: 'Business Type Mismatch' },
    { value: 'LOCATION_RESTRICTIONS', label: 'Location Restrictions' },
    { value: 'COMPLIANCE_ISSUES', label: 'Compliance Issues' },
    { value: 'FINANCIAL_CONCERNS', label: 'Financial Concerns' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!idToUse || !rejectionData.rejectionType || !rejectionData.description) {
      showError('Please fill in all fields');
      return;
    }

    if (rejectionData.description.length < 10) {
      showError('Description must be at least 10 characters long');
      return;
    }

    try {
      await rejectApplicationWithReason(idToUse, {
        rejectionType: rejectionData.rejectionType,
        description: rejectionData.description,
      });
      showSuccess('Application rejected successfully');
      onClose();
    } catch (error: any) {
      showError(error.message || 'Failed to reject application');
    }
  };

  const handleClose = () => {
    setRejectionData({ rejectionType: '', description: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Application"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            icon={XCircle}
            onClick={handleSubmit}
            disabled={isRejecting || !rejectionData.rejectionType || !rejectionData.description}
          >
            {isRejecting ? 'Rejecting...' : 'Reject Application'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Please provide a reason for rejecting this application. This information will be sent to the applicant.
          </p>
        </div>

        <Select
          label="Rejection Reason"
          value={rejectionData.rejectionType}
          onChange={(value) => setRejectionData({ rejectionType: value })}
          options={rejectionTypes}
          placeholder="Select a reason for rejection"
          fullWidth
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={rejectionData.description}
            onChange={(e) => setRejectionData({ description: e.target.value })}
            placeholder="Please provide a detailed explanation for the rejection. This will be included in the email sent to the applicant."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {rejectionData.description.length}/10 minimum characters
          </p>
        </div>

        {rejectionData.description && rejectionData.description.length < 10 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Description must be at least 10 characters long.
            </p>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What happens next:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• The application status will be changed to "Rejected"</li>
            <li>• The rejection reason will be saved in our records</li>
            <li>• An email notification will be sent to the applicant</li>
            <li>• The applicant will be able to apply again in the future</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

