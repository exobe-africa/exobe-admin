"use client";

import Input from '../common/Input';
import Select from '../common/Select';
import { Search } from 'lucide-react';

interface OrdersFiltersProps {
  filters: { searchQuery?: string; status?: string };
  setFilters: (v: Partial<{ searchQuery?: string; status?: string }>) => void;
  statuses: string[];
}

export default function OrdersFilters({ filters, setFilters, statuses }: OrdersFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by order # or email..."
            value={filters.searchQuery || ''}
            onChange={(v) => setFilters({ searchQuery: v })}
            icon={Search}
            fullWidth
          />
        </div>
        <Select
          placeholder="Filter by status"
          value={filters.status || ''}
          onChange={(v) => setFilters({ status: v })}
          options={[{ value: '', label: 'All Statuses' }, ...statuses.map((s) => ({ value: s, label: s }))]}
          fullWidth
        />
      </div>
    </div>
  );
}


