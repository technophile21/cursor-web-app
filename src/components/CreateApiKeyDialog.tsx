'use client';

import { useState } from 'react';
import { ApiKey } from '@/types/apiKey';

export interface CreateApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<ApiKey>;
}

export default function CreateApiKeyDialog({ isOpen, onClose, onSubmit }: CreateApiKeyDialogProps) {
  const [name, setName] = useState('');
  const [keyType, setKeyType] = useState('development');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      await onSubmit({ name: name.trim() });
      resetForm();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setKeyType('development');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Create a new API key</h3>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-500 mb-4">Enter a name and type for the new API key.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="key-name" className="block text-sm font-medium text-gray-700 mb-1">
              Key Name
            </label>
            <input
              id="key-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter API key name"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Used to identify this key in the dashboard.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="keyType"
                  value="development"
                  checked={keyType === 'development'}
                  onChange={() => setKeyType('development')}
                  className="mr-2"
                />
                <div>
                  <div className="text-sm font-medium">Development</div>
                  <div className="text-xs text-gray-500">For testing purposes</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="keyType"
                  value="production"
                  checked={keyType === 'production'}
                  onChange={() => setKeyType('production')}
                  className="mr-2"
                />
                <div>
                  <div className="text-sm font-medium">Production</div>
                  <div className="text-xs text-gray-500">For live applications</div>
                </div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 