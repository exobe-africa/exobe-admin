"use client";

import Modal from './Modal';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'secondary';
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  isBusy?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  onConfirm,
  onClose,
  isBusy = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose} disabled={isBusy}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={isBusy} loading={isBusy}>
            {confirmText}
          </Button>
        </div>
      }
    >
      {description && (
        <p className="text-sm text-gray-600">
          {description}
        </p>
      )}
    </Modal>
  );
}
