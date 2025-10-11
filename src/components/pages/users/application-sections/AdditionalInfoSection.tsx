"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';

interface AdditionalInfoSectionProps {
  data: any;
  application: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function AdditionalInfoSection({ data, application, isEditing, onChange }: AdditionalInfoSectionProps) {
  return (
    <Accordion title="Additional Information">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="How Did You Hear About Us?"
          value={data.how_did_you_hear || ''}
          onChange={(v) => onChange('how_did_you_hear', v)}
          disabled={!isEditing}
          fullWidth
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={data.agree_to_terms || false}
            onChange={(e) => onChange('agree_to_terms', e.target.checked)}
            disabled={!isEditing}
            className="w-4 h-4 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E]"
          />
          <label className="ml-2 text-sm text-gray-700">Agrees to Terms & Conditions</label>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>Applied:</strong> {new Date(application.created_at).toLocaleDateString()} at {new Date(application.created_at).toLocaleTimeString()}
        </p>
      </div>
    </Accordion>
  );
}

