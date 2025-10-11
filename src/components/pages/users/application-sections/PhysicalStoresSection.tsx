"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';
import Select from '../../../common/Select';

interface PhysicalStoresSectionProps {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function PhysicalStoresSection({ data, isEditing, onChange }: PhysicalStoresSectionProps) {
  return (
    <Accordion title="Physical Stores & Distribution">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Physical Stores"
          value={data.physical_stores || ''}
          onChange={(v) => onChange('physical_stores', v)}
          options={[
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' },
          ]}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Number of Stores"
          value={data.number_of_stores || ''}
          onChange={(v) => onChange('number_of_stores', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Select
          label="Supplier to Retailers"
          value={data.supplier_to_retailers || ''}
          onChange={(v) => onChange('supplier_to_retailers', v)}
          options={[
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' },
          ]}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Other Marketplaces"
          value={data.other_marketplaces || ''}
          onChange={(v) => onChange('other_marketplaces', v)}
          disabled={!isEditing}
          fullWidth
        />
      </div>
    </Accordion>
  );
}

