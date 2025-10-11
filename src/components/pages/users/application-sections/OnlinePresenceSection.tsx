"use client";

import Accordion from '../../../common/Accordion';
import Input from '../../../common/Input';

interface OnlinePresenceSectionProps {
  data: any;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

export default function OnlinePresenceSection({ data, isEditing, onChange }: OnlinePresenceSectionProps) {
  return (
    <Accordion title="Online Presence">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Website"
          value={data.website || ''}
          onChange={(v) => onChange('website', v)}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="Social Media"
          value={data.social_media || ''}
          onChange={(v) => onChange('social_media', v)}
          disabled={!isEditing}
          fullWidth
        />
      </div>
    </Accordion>
  );
}

