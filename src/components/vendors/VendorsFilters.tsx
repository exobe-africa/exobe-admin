"use client";

import Input from '../common/Input';
import Select from '../common/Select';
import { Search } from 'lucide-react';
import type { VendorFilters } from '../../store/vendors';

interface VendorsFiltersProps {
  filters: VendorFilters;
  onChange: (partial: Partial<VendorFilters>) => void;
}

export default function VendorsFilters({ filters, onChange }: VendorsFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by vendor name or email..."
            value={filters.searchQuery}
            onChange={(value) => onChange({ searchQuery: value })}
            icon={Search}
            fullWidth
          />
        </div>
        <Select
          placeholder="Filter by status"
          value={filters.status}
          onChange={(value) => onChange({ status: value })}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'SUSPENDED', label: 'Suspended' },
          ]}
          fullWidth
        />
      </div>
    </div>
  );
}


