"use client";

import DataTable from '../../common/DataTable';
import { useRouter } from 'next/navigation';
import Badge from '../../common/Badge';
import { Edit, Trash2, Eye } from 'lucide-react';

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

interface UsersListProps {
  users: UserRow[];
  onView: (user: UserRow) => void;
  onEdit: (user: UserRow) => void;
  onDelete: (userId: string) => void;
}

export default function UsersList({ users, onView, onEdit, onDelete }: UsersListProps) {
  const router = useRouter();
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    {
      key: 'role',
      label: 'Role',
      render: (user: UserRow) => (
        <Badge variant={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'info' : 'neutral'}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: UserRow) => (
        <Badge variant={user.is_active ? 'success' : 'warning'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { key: 'created_at', label: 'Joined', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: UserRow) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(user)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(user)}
            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
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
      data={users}
      keyExtractor={(user) => user.id}
      emptyMessage="No users found"
      onRowClick={(user) => {
        if (user.role === 'RETAILER' || user.role === 'WHOLESALER') {
          router.push(`/vendors?userId=${user.id}`);
        } else {
          onView(user);
        }
      }}
    />
  );
}

