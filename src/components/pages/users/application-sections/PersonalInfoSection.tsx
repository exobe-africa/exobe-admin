"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';

interface PersonalInfoSectionProps {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function PersonalInfoSection({ data, isEditing, onChange }: PersonalInfoSectionProps) {
  return (
    <Accordion title="Personal Information" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={data.first_name || ''}
          onChange={(v) => onChange('first_name', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Last Name"
          value={data.last_name || ''}
          onChange={(v) => onChange('last_name', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Email"
          value={data.email || ''}
          onChange={(v) => onChange('email', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Phone"
          value={data.phone || ''}
          onChange={(v) => onChange('phone', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Landline (Optional)"
          value={data.landline || ''}
          onChange={(v) => onChange('landline', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="ID Number"
          value={data.sa_id_number || ''}
          onChange={(v) => onChange('sa_id_number', v)}
          disabled={!isEditing}
          fullWidth
        />
      </div>
    </Accordion>
  );
}

