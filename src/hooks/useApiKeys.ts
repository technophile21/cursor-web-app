import { useState, useCallback } from 'react';
import { ApiKey, CreateApiKeyDto, UpdateApiKeyDto } from '@/types/apiKey';
import { apiKeyService } from '@/services/apiKeyService';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiKeyService.getAll();
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createApiKey = useCallback(async (data: CreateApiKeyDto) => {
    try {
      setLoading(true);
      setError(null);
      const newApiKey = await apiKeyService.create(data);
      setApiKeys(prev => [...prev, newApiKey]);
      return newApiKey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApiKey = useCallback(async (id: string, data: UpdateApiKeyDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedApiKey = await apiKeyService.update(id, data);
      setApiKeys(prev => prev.map(key => key.id === id ? updatedApiKey : key));
      return updatedApiKey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApiKey = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiKeyService.delete(id);
      setApiKeys(prev => prev.filter(key => key.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}; 