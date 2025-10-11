"use client";

import Modal from '../../common/Modal';
import Badge from '../../common/Badge';

type Role = 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | 'RETAILER' | 'WHOLESALER' | 'SERVICE_PROVIDER';

type UserRow = {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
};

interface ViewUserModalProps {
  isOpen: boolean;
  user: UserRow | null;
  onClose: () => void;
}

export default function ViewUserModal({ isOpen, user, onClose }: ViewUserModalProps) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-3xl font-bold">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {user.name || `${(user as any).first_name} ${(user as any).last_name}`}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'info' : 'neutral'}>
                {user.role}
              </Badge>
              <Badge variant={user.is_active ? 'success' : 'warning'}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone</p>
            <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Joined</p>
            <p className="font-medium text-gray-900">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Role</p>
            <p className="font-medium text-gray-900">{user.role}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

