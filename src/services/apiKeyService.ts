import { ApiKey, CreateApiKeyDto, UpdateApiKeyDto } from '@/types/apiKey';

const API_BASE_URL = '/api/keys';

export const apiKeyService = {
  async getAll(): Promise<ApiKey[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch API keys');
    }
    return response.json();
  },

  async create(data: CreateApiKeyDto): Promise<ApiKey> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create API key');
    }
    return response.json();
  },

  async update(id: string, data: UpdateApiKeyDto): Promise<ApiKey> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update API key');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete API key');
    }
  },
}; 