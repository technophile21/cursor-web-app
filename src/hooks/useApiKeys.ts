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
    setLoading(true);
    setError(null);
    
    try {
      const newApiKey = await apiKeyService.create(data);
      setApiKeys(prev => [...prev, newApiKey]);
      setLoading(false);
      return newApiKey;
    } catch (err) {
      setLoading(false);
      // Set the error state but don't throw again - this prevents console errors
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Still throw the error for the component to handle UI feedback
      throw err;
    }
  }, []);

  const updateApiKey = useCallback(async (id: string, data: UpdateApiKeyDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedApiKey = await apiKeyService.update(id, data);
      setApiKeys(prev => prev.map(key => key.id === id ? updatedApiKey : key));
      setLoading(false);
      return updatedApiKey;
    } catch (err) {
      setLoading(false);
      // Set the error state but don't throw again - this prevents console errors
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Still throw the error for the component to handle UI feedback
      throw err;
    }
  }, []);

  const deleteApiKey = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiKeyService.delete(id);
      setApiKeys(prev => prev.filter(key => key.id !== id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // Set the error state but don't throw again - this prevents console errors
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Still throw the error for the component to handle UI feedback
      throw err;
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