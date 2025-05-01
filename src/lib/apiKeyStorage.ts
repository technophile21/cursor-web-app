import { ApiKey } from '@/types/apiKey';

// In-memory storage for demo purposes
// In a real application, you would use a database
let apiKeys: ApiKey[] = [];

export const apiKeyStorage = {
  getAll: () => apiKeys,
  
  add: (key: ApiKey) => {
    apiKeys.push(key);
    return key;
  },
  
  update: (id: string, data: Partial<ApiKey>) => {
    const index = apiKeys.findIndex(key => key.id === id);
    if (index === -1) return null;
    
    apiKeys[index] = { ...apiKeys[index], ...data };
    return apiKeys[index];
  },
  
  delete: (id: string) => {
    const index = apiKeys.findIndex(key => key.id === id);
    if (index === -1) return false;
    
    apiKeys.splice(index, 1);
    return true;
  }
}; 