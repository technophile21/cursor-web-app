import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}
interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}
export default function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="mb-6">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center mb-2">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mr-2"
          />
          <span className="font-medium">{opt.label}</span>
          {opt.description && <span className="ml-2 text-xs text-gray-500">{opt.description}</span>}
        </label>
      ))}
    </div>
  );
} 