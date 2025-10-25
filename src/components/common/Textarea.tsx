"use client";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  error,
  required = false,
  disabled = false,
  fullWidth = false,
}: TextareaProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

