"use client";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  id,
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E] focus:ring-2 checked:bg-[#C8102E] checked:border-[#C8102E]"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

