"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';

interface AddressSectionProps {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function AddressSection({ data, isEditing, onChange }: AddressSectionProps) {
  return (
    <Accordion title="Address Information">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Address"
            value={data.address || ''}
            onChange={(v) => onChange('address', v)}
            disabled={!isEditing}
            fullWidth
          />
        </div>
        <Input
          label="City"
          value={data.city || ''}
          onChange={(v) => onChange('city', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Province"
          value={data.province || ''}
          onChange={(v) => onChange('province', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Postal Code"
          value={data.postal_code || ''}
          onChange={(v) => onChange('postal_code', v)}
          disabled={!isEditing}
          fullWidth
        />
      </div>
    </Accordion>
  );
}

