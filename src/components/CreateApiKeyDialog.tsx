'use client';

import { useState } from 'react';
import { ApiKey } from '@/types/apiKey';
import Modal from './Modal';
import TextInput from './form/TextInput';
import RadioGroup from './form/RadioGroup';
import Button from './form/Button';

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

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Create a new API key">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Key Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          error={error || undefined}
        />
        <RadioGroup
          name="keyType"
          options={[
            { value: 'development', label: 'Development', description: 'For testing purposes' },
            { value: 'production', label: 'Production', description: 'For live applications' },
          ]}
          value={keyType}
          onChange={setKeyType}
        />
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={() => { resetForm(); onClose(); }} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 