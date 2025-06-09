import { ApiKey, CreateApiKeyDto, UpdateApiKeyDto } from '@/types/apiKey';
import { getSession } from 'next-auth/react';

const API_BASE_URL = '/api/keys';

const getHeaders = async () => {
  const session = await getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.user?.accessToken ? { Authorization: `Bearer ${session.user.accessToken}` } : {})
  };
};

export const apiKeyService = {
  async getAll(): Promise<ApiKey[]> {
    const headers = await getHeaders();
    const response = await fetch(API_BASE_URL, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Failed to fetch API keys';
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async create(data: CreateApiKeyDto): Promise<ApiKey> {
    const headers = await getHeaders();
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Failed to create API key';
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  async update(id: string, data: UpdateApiKeyDto): Promise<ApiKey> {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Failed to update API key';
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Failed to delete API key';
      throw new Error(errorMessage);
    }
  },
}; 