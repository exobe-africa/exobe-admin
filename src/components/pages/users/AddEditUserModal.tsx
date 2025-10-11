"use client";

import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { Mail, Phone } from 'lucide-react';

type Role = 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | 'RETAILER' | 'WHOLESALER' | 'SERVICE_PROVIDER';

interface AddEditUserModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    role: Role;
  };
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (field: string, value: string) => void;
}

export default function AddEditUserModal({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}: AddEditUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit User' : 'Add New User'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {isEditing ? 'Update User' : 'Add User'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={(value) => onFormChange('name', value)}
          required
          fullWidth
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(value) => onFormChange('email', value)}
          icon={Mail}
          required
          fullWidth
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={(value) => onFormChange('phone', value)}
          icon={Phone}
          required
          fullWidth
        />
      </div>
    </Modal>
  );
}

