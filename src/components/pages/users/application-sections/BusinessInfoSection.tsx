"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';
import Select from '../../../common/Select';

interface BusinessInfoSectionProps {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function BusinessInfoSection({ data, isEditing, onChange }: BusinessInfoSectionProps) {
  return (
    <Accordion title="Business Information" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Seller Role"
          value={data.seller_role || ''}
          onChange={(v) => onChange('seller_role', v)}
          options={[
            { value: 'RETAILER', label: 'Retailer' },
            { value: 'WHOLESALER', label: 'Wholesaler' },
          ]}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Business Type"
          value={data.business_type || ''}
          onChange={(v) => onChange('business_type', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Business Name"
          value={data.business_name || ''}
          onChange={(v) => onChange('business_name', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Business Registration"
          value={data.business_registration || ''}
          onChange={(v) => onChange('business_registration', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Applicant Type"
          value={data.applicant_type || ''}
          onChange={(v) => onChange('applicant_type', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Identification Type"
          value={data.identification_type || ''}
          onChange={(v) => onChange('identification_type', v)}
          disabled={!isEditing}
          fullWidth
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Summary
        </label>
        <textarea
          value={data.business_summary || ''}
          onChange={(e) => onChange('business_summary', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    </Accordion>
  );
}

