import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export default function TextInput({ label, error, ...props }: TextInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input {...props} className="w-full px-3 py-2 border rounded-md" />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
} 