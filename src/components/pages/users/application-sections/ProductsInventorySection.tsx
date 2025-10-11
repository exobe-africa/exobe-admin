"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';

interface ProductsInventorySectionProps {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function ProductsInventorySection({ data, isEditing, onChange }: ProductsInventorySectionProps) {
  return (
    <Accordion title="Products & Inventory">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Primary Category"
          value={data.primary_category || ''}
          onChange={(v) => onChange('primary_category', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Stock Type"
          value={data.stock_type || ''}
          onChange={(v) => onChange('stock_type', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Unique Products"
          value={data.unique_products || ''}
          onChange={(v) => onChange('unique_products', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Owned Brands"
          value={data.owned_brands || ''}
          onChange={(v) => onChange('owned_brands', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Reseller Brands"
          value={data.reseller_brands || ''}
          onChange={(v) => onChange('reseller_brands', v)}
          disabled={!isEditing}
          fullWidth
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Description
        </label>
        <textarea
          value={data.product_description || ''}
          onChange={(e) => onChange('product_description', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    </Accordion>
  );
}

