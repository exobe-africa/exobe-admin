"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';
import Select from '../../../common/Select';

interface VATFinancialSectionProps {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function VATFinancialSection({ data, isEditing, onChange }: VATFinancialSectionProps) {
  return (
    <Accordion title="VAT & Financial Information">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="VAT Registered"
          value={data.vat_registered || ''}
          onChange={(v) => onChange('vat_registered', v)}
          options={[
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' },
          ]}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="VAT Number"
          value={data.vat_number || ''}
          onChange={(v) => onChange('vat_number', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Monthly Revenue"
          value={data.monthly_revenue || ''}
          onChange={(v) => onChange('monthly_revenue', v)}
          disabled={!isEditing}
          fullWidth
        />
      </div>
    </Accordion>
  );
}

