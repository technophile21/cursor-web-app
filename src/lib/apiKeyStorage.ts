import { ApiKey } from '@/types/apiKey';

// In-memory storage for demo purposes
// In a real application, you would use a database
const apiKeys: ApiKey[] = [];

export const apiKeyStorage = {
  getAll: () => apiKeys,
  
  isNameUnique: (name: string, excludeId?: string) => {
    return !apiKeys.some(key => 
      key.name.toLowerCase() === name.toLowerCase() && 
      (!excludeId || key.id !== excludeId)
    );
  },
  
  add: (key: ApiKey) => {
    if (!apiKeyStorage.isNameUnique(key.name)) {
      throw new Error('API key name must be unique');
    }
    apiKeys.push(key);
    return key;
  },
  
  update: (id: string, data: Partial<ApiKey>) => {
    const index = apiKeys.findIndex(key => key.id === id);
    if (index === -1) return null;
    
    // Check name uniqueness if name is being updated
    if (data.name && !apiKeyStorage.isNameUnique(data.name, id)) {
      throw new Error('API key name must be unique');
    }
    
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