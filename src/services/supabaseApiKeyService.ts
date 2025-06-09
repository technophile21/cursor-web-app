import { ApiKey, CreateApiKeyDto, UpdateApiKeyDto } from '@/types/apiKey';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'api_keys';

// Helper function to convert camelCase to snake_case
const camelToSnake = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// Helper function to convert snake_case to camelCase
const snakeToCamel = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Function to transform object keys from camelCase to snake_case
const transformToSnakeCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  Object.keys(obj).forEach(key => {
    result[camelToSnake(key)] = obj[key];
  });
  return result;
};

// Function to transform object keys from snake_case to camelCase
const transformToCamelCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  Object.keys(obj).forEach(key => {
    result[snakeToCamel(key)] = obj[key];
  });
  return result;
};

export const supabaseApiKeyService = {
  async getAll(): Promise<ApiKey[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*');
    
    if (error) {
      console.error('Error fetching API keys:', error);
      throw new Error('Failed to fetch API keys');
    }
    
    // Transform array of objects from snake_case to camelCase
    return data ? data.map(item => transformToCamelCase(item) as unknown as ApiKey) : [];
  },

  async create(dto: CreateApiKeyDto & { userId: string }): Promise<ApiKey> {
    // Check for name uniqueness
    const { data: existingKeys } = await supabase
      .from(TABLE_NAME)
      .select('name')
      .ilike('name', dto.name)
      .eq('user_id', dto.userId);
    
    if (existingKeys && existingKeys.length > 0) {
      throw new Error('API key name must be unique');
    }
    
    // Create the API key object with camelCase properties
    const newApiKeyCamel: ApiKey = {
      id: uuidv4(),
      name: dto.name,
      key: `sk-${uuidv4()}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      userId: dto.userId
    };
    
    // Transform to snake_case for database insertion
    const newApiKeySnake = transformToSnakeCase(newApiKeyCamel as unknown as Record<string, unknown>);
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(newApiKeySnake)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating API key:', error);
      throw new Error('Failed to create API key');
    }
    
    // Transform result back to camelCase
    return transformToCamelCase(data) as unknown as ApiKey;
  },

  async update(id: string, dto: UpdateApiKeyDto): Promise<ApiKey> {
    // Check for name uniqueness if name is being updated
    if (dto.name) {
      const { data: existingKeys } = await supabase
        .from(TABLE_NAME)
        .select('name')
        .ilike('name', dto.name)
        .neq('id', id);
      
      if (existingKeys && existingKeys.length > 0) {
        throw new Error('API key name must be unique');
      }
    }
    
    // Transform update data to snake_case
    const updateDataSnake = transformToSnakeCase(dto as Record<string, unknown>);
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updateDataSnake)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating API key:', error);
      throw new Error('Failed to update API key');
    }
    
    // Transform result back to camelCase
    return transformToCamelCase(data) as unknown as ApiKey;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting API key:', error);
      throw new Error('Failed to delete API key');
    }
  },

  async validateKey(key: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .eq('key', key)
      .eq('is_active', true)
      .single();
    return !!(data && !error);
  },

  async upsertUser(user: { email: string; name?: string | null; image?: string | null }) {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          email: user.email,
          name: user.name,
          image: user.image,
        },
        { onConflict: 'email' }
      );
    if (error) {
      console.error('Supabase user upsert error:', error);
      throw error;
    }
    return data;
  },

  async getById(id: string): Promise<ApiKey | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching API key:', error)
      throw new Error('Failed to fetch API key')
    }

    return data ? transformToCamelCase(data) as unknown as ApiKey : null
  },
}; 