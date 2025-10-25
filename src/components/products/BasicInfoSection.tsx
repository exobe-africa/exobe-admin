"use client";

import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";

interface BasicInfoSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoSection({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      <Input
        label="Product Title"
        value={title}
        onChange={onTitleChange}
        placeholder="Enter product title"
        required
        fullWidth
      />
      <Textarea
        label="Description"
        value={description}
        onChange={onDescriptionChange}
        placeholder="Enter product description"
        rows={5}
        fullWidth
      />
    </div>
  );
}

