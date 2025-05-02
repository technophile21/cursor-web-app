import { useState } from 'react';
import { ApiKey } from '@/types/apiKey';

export interface UseCreateApiKeyDialogControllerProps {
  onSubmit: (data: { name: string }) => Promise<ApiKey>;
  onClose: () => void;
}

export function useCreateApiKeyDialogController({ onSubmit, onClose }: UseCreateApiKeyDialogControllerProps) {
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

  return {
    name,
    setName,
    keyType,
    setKeyType,
    isLoading,
    error,
    handleSubmit,
    resetForm,
  };
} 