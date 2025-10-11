"use client";

import Input from '../../common/Input';
import Select from '../../common/Select';
import { Search } from 'lucide-react';

type Role = 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | 'RETAILER' | 'WHOLESALER' | 'SERVICE_PROVIDER';

interface UsersFiltersProps {
  searchQuery: string;
  filterRole: Role | '';
  filterStatus: 'Active' | 'Inactive' | '';
  onSearchChange: (value: string) => void;
  onRoleChange: (value: Role | '') => void;
  onStatusChange: (value: 'Active' | 'Inactive' | '') => void;
}

export default function UsersFilters({
  searchQuery,
  filterRole,
  filterStatus,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: UsersFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={onSearchChange}
            icon={Search}
            fullWidth
          />
        </div>
        <Select
          placeholder="Filter by role"
          value={filterRole}
          onChange={(v) => onRoleChange(v as Role | '')}
          options={[
            { value: '', label: 'All Roles' },
            { value: 'ADMIN', label: 'ADMIN' },
            { value: 'SUPER_ADMIN', label: 'SUPER_ADMIN' },
            { value: 'CUSTOMER', label: 'CUSTOMER' },
            { value: 'RETAILER', label: 'RETAILER' },
            { value: 'WHOLESALER', label: 'WHOLESALER' },
            { value: 'SERVICE_PROVIDER', label: 'SERVICE_PROVIDER' },
          ]}
          fullWidth
        />
        <Select
          placeholder="Filter by status"
          value={filterStatus}
          onChange={(v) => onStatusChange(v as 'Active' | 'Inactive' | '')}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
          fullWidth
        />
      </div>
    </div>
  );
}

