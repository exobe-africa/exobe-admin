"use client";

import Input from '../../common/Input';
import Select from '../../common/Select';
import { Search } from 'lucide-react';

interface ApplicationsFiltersProps {
  searchQuery: string;
  filterStatus: string;
  activeTab: 'seller' | 'service-provider';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function ApplicationsFilters({
  searchQuery,
  filterStatus,
  activeTab,
  onSearchChange,
  onStatusChange,
}: ApplicationsFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder={`Search ${activeTab === 'seller' ? 'sellers' : 'service providers'}...`}
            value={searchQuery}
            onChange={onSearchChange}
            icon={Search}
            fullWidth
          />
        </div>
        <Select
          placeholder="Filter by status"
          value={filterStatus}
          onChange={onStatusChange}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
          fullWidth
        />
      </div>
    </div>
  );
}

